from django.urls import path
# from webapp import xhr
from webapp import create


urlpatterns = [

    # # # # Get objects
    # path('get_all_groups/', xhr.GetAllGroups.as_view()),
    # path('get_group_days/', xhr.GetGroupDays.as_view()),
    # path('get_all_agents/', xhr.GetAllAgents.as_view()),
    # path('get_all_clients/', xhr.GetAllClients.as_view()),
    # path('get_all_airports/', xhr.GetAllAirports.as_view()),
    # path('get_all_airports_raw/', xhr.GetAllAirportsRaw.as_view()),
    # path('get_airport_terminals/', xhr.GetAirportTerminals.as_view()),
    # path('get_all_airlines/', xhr.GetAllAirlines.as_view()),
    # path('get_all_ports/', xhr.GetAllPorts.as_view()),
    # path('get_all_railway_stations/', xhr.GetAllRailwayStations.as_view()),
    # path('get_group_leaders/', xhr.GetGroupLeaders.as_view()),

    # path('get_all_continents/', xhr.GetAllContinents.as_view()),
    # path('get_all_countries/', xhr.GetAllCountries.as_view()),
    # path('get_all_states/', xhr.GetAllStates.as_view()),
    # path('get_all_cities/', xhr.GetAllCities.as_view()),
    # path('get_all_areas/', xhr.GetAllAreas.as_view()),
    # path('get_all_hotels/', xhr.GetAllHotels.as_view()),
    # path('get_traveldays_by_daterange/', xhr.GetTraveldaysByDaterange.as_view()),
    # path('get_all_attractions/', xhr.GetAllAttractions.as_view()),
    # path('get_all_hotel_categories/', xhr.GetAllHotelCategories.as_view()),
    # path('get_all_coach_operator_categories/', xhr.GetAllCoachOperatorCategories.as_view()),
    # re_path(r'get_hotel/(?P<hotel_name>.*)$', xhr.GetHotel.as_view()),
    # re_path(r'get_agent/(?P<agent_name>.*)$', xhr.GetAgent.as_view()),
    # re_path(r'get_entertainment_supplier/(?P<entertainment_supplier_name>.*)$', xhr.GetEntertainmentSupplier.as_view()),
    # path('get_all_drivers/', xhr.GetAllDrivers.as_view()),
    # path('get_all_coach_operators/', xhr.GetAllCoachOperators.as_view()),
    # path('get_all_charter_brokers/', xhr.GetAllCharterBrokers.as_view()),
    # path('get_all_coaches/', xhr.GetAllCoaches.as_view()),
    # path('get_all_repair_shops/', xhr.GetAllRepairShops.as_view()),
    # path('get_all_repair_shop_types/', xhr.GetAllRepairTypes.as_view()),
    # path('get_all_users/', xhr.GetAllUsers.as_view()),
    # path('get_all_ferry_ticket_agencies/', xhr.GetAllFerryTicketAgencies.as_view()),
    # path('get_all_cruising_companies/', xhr.GetAllCruisingCompanies.as_view()),
    # path('get_all_guides/', xhr.GetAllGuides.as_view()),
    # path('get_all_restaurants/', xhr.GetAllRestaurants.as_view()),
    # path('get_all_restaurant_types/', xhr.GetAllRestaurantTypes.as_view()),
    # path('get_all_entertainment_suppliers/', xhr.GetAllEntertainmentSuppliers.as_view()),
    # path('get_all_sport_event_suppliers/', xhr.GetAllSportEventSuppliers.as_view()),
    # path('get_all_teleferik_companies/', xhr.GetAllTeleferikCompanies.as_view()),
    # path('get_all_theaters/', xhr.GetAllTheaters.as_view()),
    # path('get_all_train_ticket_agencies/', xhr.GetAllTrainTicketAgencies.as_view()),
    # path('get_all_parking_lots/', xhr.GetAllParkingLots.as_view()),
    # path('get_all_dmcs/', xhr.GetAllDestinationManagementCompanies.as_view()),
    # path('get_nav_notifications/', xhr.GetNavNotifications.as_view()),
    # path('get_payment_details/', xhr.GetPaymentDetails.as_view()),

    # # # # Create
    path('add_country/', create.AddCountry.as_view()),
    path('add_city/', create.AddCity.as_view()),
    path('add_province/', create.AddProvince.as_view()),

]
