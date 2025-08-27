from django.urls import path, re_path
from webapp.administration import views as views
from webapp.administration import xhr as administration_xhr


urlpatterns = [

    # Consultants
    path('all_consultants/', views.AllConsultants.as_view()),
    path("consultant/<str:consultant_id>/", views.ConsultantView.as_view(), name="consultant-detail"),
    path('delete_consultant/', administration_xhr.DeleteConsultant.as_view()),

    # Banks
    path('all_banks/', views.AllBanks.as_view()),
    path("bank/<str:bank_id>/", views.BankView.as_view(), name="bank-detail"),
    path('delete_bank/', administration_xhr.DeleteBank.as_view()),

    # Insurance Carriers
    path('all_insurance_carriers/', views.AllInsuranceCarriers.as_view()),
    path("insurance_carrier/<str:insucarrier_id>/", views.InsuranceCarrierView.as_view(), name="insurance-carrier-detail"),
    path('delete_insurance_carrier/', administration_xhr.DeleteInsuranceCarrier.as_view()),

]
