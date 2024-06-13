from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.urls import reverse
from ..models import Documento
from ..forms import DocumentoForm
from django.http import JsonResponse, FileResponse
import mimetypes

#------------------Gestor de Documentos    
@login_required
def gestor_documentos(request):
    nombre_usuario = request.user.nombre if request.user.is_authenticated else "Invitado"
    documentos = Documento.objects.all()
    seccion_choices = Documento.SECCION_CHOICES

    if request.method == 'POST':
        form = DocumentoForm(request.POST, request.FILES)
        if form.is_valid():
            archivo = form.cleaned_data['archivo']
            seccion = form.cleaned_data['seccion']
            sub_seccion = form.cleaned_data['sub_seccion']
            personal = form.cleaned_data['personal']
            ficha_servicio = form.cleaned_data['ficha_servicio']

            if seccion == 'Otros':
                sub_seccion = None
                personal = None
                ficha_servicio = None

            documento = Documento(
                archivo=archivo,
                nombre=archivo.name,
                seccion=seccion,
                sub_seccion=sub_seccion,
                personal=personal,
                ficha_servicio=ficha_servicio
            )
            documento.save()

            return JsonResponse({'success': True})
        else:
            return JsonResponse({'success': False, 'errors': form.errors})
    else:
        form = DocumentoForm()

    context = {
        'documentos': documentos,
        'nombre_usuario': nombre_usuario,
        'form': form,
        'seccion_choices': seccion_choices,
    }
    return render(request, 'html/gestorDocumentos.html', context)

@login_required
def obtener_documentos(request):
    if 'documento_id' in request.GET:
        documento_id = request.GET.get('documento_id')
        documento = get_object_or_404(Documento, id=documento_id)

        # Obtener el tipo de contenido del archivo
        content_type, encoding = mimetypes.guess_type(documento.archivo.name)

        # Obtener la URL completa del archivo
        documento_url = request.build_absolute_uri(reverse('erp:obtener-documentos') + '?documento_id=' + str(documento_id))

        # Crear la respuesta FileResponse con el tipo de contenido correcto
        response = FileResponse(documento.archivo.open('rb'), content_type=content_type)
        response['Content-Disposition'] = 'attachment; filename="{}"'.format(documento.nombre)

        return response
    else:
        seccion = request.GET.get('seccion')
        subseccion = request.GET.get('sub_seccion')

        if seccion is None and subseccion is None:
            # Obtener todos los documentos sin filtrar
            documentos = Documento.objects.all().values('id', 'nombre', 'fecha_subida', 'seccion', 'sub_seccion')
        else:
            filtros = {}
            if seccion:
                if seccion == 'Otros':
                    filtros['sub_seccion__isnull'] = True
                else:
                    filtros['seccion'] = seccion

            if subseccion:
                filtros['sub_seccion'] = subseccion

            documentos = Documento.objects.filter(**filtros).values('id', 'nombre', 'fecha_subida', 'seccion', 'sub_seccion')

        return JsonResponse({'documentos': list(documentos)}, safe=False)

@login_required
def eliminar_documento(request, documento_id):
    if request.method == 'POST':
        documento = get_object_or_404(Documento, id=documento_id)
        documento.delete()
        messages.success(request, 'Documento eliminado exitosamente.')
    return redirect('erp:gestor-documentos')
