from django.urls import path
from webapp.maps import map_views as map_views
from webapp.maps import map_xhr as map_xhr


urlpatterns = [

    # # # Views
    path('daily_status/', map_views.DailyStatus.as_view()),

    # Main
    path('show_results/', map_views.ShowResults.as_view()),
    path('get_surrounding_pois/', map_xhr.GetSurroundingPOIS.as_view()),
    path('send_massive_email/', map_xhr.SendMassiveEmail.as_view()),

]
