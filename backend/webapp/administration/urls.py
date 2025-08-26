from django.urls import path, re_path
from webapp.administration import views as views
from webapp.administration import xhr as administration_xhr


urlpatterns = [

    # Consultants
    path('all_consultants/', views.AllConsultants.as_view()),
    path("consultant/<str:consultant_id>/", views.ConsultantView.as_view(), name="consultant-detail"),
    path('delete_consultant/', administration_xhr.DeleteConsultant.as_view()),

]
