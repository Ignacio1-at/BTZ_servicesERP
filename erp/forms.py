from django import forms
from .models import Documento, Personal, FichaServicio

class CustomLoginForm(forms.Form):
    email = forms.EmailField(label='E-mail')
    password = forms.CharField(label='Contraseña', widget=forms.PasswordInput)

class DocumentoForm(forms.Form):
    archivo = forms.FileField()
    seccion = forms.ChoiceField(choices=Documento.SECCION_CHOICES)
    sub_seccion = forms.ChoiceField(choices=Documento.SUB_SECCION_CHOICES, required=False)
    personal = forms.ModelChoiceField(queryset=Personal.objects.all(), required=False)
    ficha_servicio = forms.ModelChoiceField(queryset=FichaServicio.objects.all(), required=False)