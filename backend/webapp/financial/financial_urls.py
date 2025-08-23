from django.urls import path
from webapp.financial import financial_views as financial_views

urlpatterns = [
    path('get_payments_by_daterange/', financial_views.GetPaymentsByDaterange.as_view()),
    path('get_payments_by_supplier/', financial_views.GetPaymentsBySupplier.as_view()),
    path('get_all_pending_payments/', financial_views.GetAllPendingPayments.as_view()),
    path('download_payment_order/', financial_views.DownloadPaymentOrder.as_view()),
    path('get_payment_order/', financial_views.GetPaymentOrder.as_view()),
    path('get_all_deposits/', financial_views.GetAllDeposits.as_view()),
    path('delete_deposit/', financial_views.DeleteDeposit.as_view()),
]
