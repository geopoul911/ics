from django.urls import path
from webapp.reports import reports_views


urlpatterns = [

    # Views
    path('agent/', reports_views.ReportsAgent.as_view()),
    path('airport/', reports_views.ReportsAirport.as_view()),
    path('client/', reports_views.ReportsClient.as_view()),
    path('coach_operator/', reports_views.ReportsCoachOperator.as_view()),
    path('driver/', reports_views.ReportsDriver.as_view()),
    path('expiring_documents/', reports_views.ReportsExpiringDocuments.as_view()),
    path('group_leader/', reports_views.ReportsGroupLeader.as_view()),
    path('hotel/', reports_views.ReportsHotel.as_view()),
    path('user/', reports_views.ReportsUser.as_view()),
    path('sent_emails/', reports_views.ReportsSentEmails.as_view()),
    path('services/', reports_views.ReportsServices.as_view()),
    path('site_statistics/', reports_views.ReportsSiteStatistics.as_view()),
    path('group_stats/', reports_views.GroupStats.as_view()),
    path('option_dates/', reports_views.ReportsOptionDates.as_view()),
]
