# from django.urls import path, re_path
# from webapp.data_management import data_mgm_views, data_mgm_xhr

urlpatterns = []

# urlpatterns = [

#     # # # Data management

#     # # Views

#     # Agents
#     path('all_agents/', data_mgm_views.AllAgents.as_view()),
#     re_path(r'agent/(?P<agent_id>.*)$', data_mgm_views.AgentView.as_view()),

#     # Airlines
#     path('all_airlines/', data_mgm_views.AllAirlines.as_view()),
#     re_path(r'airline/(?P<airline_id>.*)$', data_mgm_views.AirlineView.as_view()),

#     # Airports
#     path('all_airports/', data_mgm_views.AllAirports.as_view()),
#     re_path(r'airport/(?P<airport_name>.*)$', data_mgm_views.AirportView.as_view()),

#     # Attractions
#     path('all_attractions/', data_mgm_views.AllAttractions.as_view()),
#     re_path(r'attraction/(?P<attraction_id>.*)$', data_mgm_views.AttractionView.as_view()),

#     # Clients
#     path('all_clients/', data_mgm_views.AllClients.as_view()),
#     re_path(r'client/(?P<client_id>.*)$', data_mgm_views.ClientView.as_view()),

#     # Coaches
#     path('all_coaches/', data_mgm_views.AllCoaches.as_view()),
#     re_path(r'coach/(?P<coach_id>.*)$', data_mgm_views.CoachView.as_view()),

#     # Contracts
#     path('all_contracts/', data_mgm_views.AllContracts.as_view()),
#     re_path(r'contract/(?P<contract_id>.*)$', data_mgm_views.ContractView.as_view()),

#     # Coach Operators
#     path('all_coach_operators/', data_mgm_views.AllCoachOperators.as_view()),
#     re_path(r'coach_operator/(?P<coach_operator_id>.*)$', data_mgm_views.CoachOperatorView.as_view()),

#     # Cruising Companies
#     path('all_cruising_companies/', data_mgm_views.AllCruisingCompanies.as_view()),
#     re_path(r'cruising_company/(?P<cruising_company_id>.*)$', data_mgm_views.CruisingCompanyView.as_view()),

#     # Drivers
#     path('all_drivers/', data_mgm_views.AllDrivers.as_view()),
#     re_path(r'driver/(?P<driver_id>.*)$', data_mgm_views.DriverView.as_view()),

#     # Ferry Ticket Agencies
#     path('all_ferry_ticket_agencies/', data_mgm_views.AllFerryTicketAgencies.as_view()),
#     re_path(r'ferry_ticket_agency/(?P<ferry_ticket_agency_id>.*)$', data_mgm_views.FerryTicketAgencyView.as_view()),

#     # Destination Management Companies
#     path('all_dmcs/', data_mgm_views.AllDMCs.as_view()),
#     re_path(r'dmc/(?P<dmc_id>.*)$', data_mgm_views.DMCView.as_view()),

#     # Group Leaders
#     path('all_group_leaders/', data_mgm_views.AllGroupLeaders.as_view()),
#     re_path(r'group_leader/(?P<group_leader_id>.*)$', data_mgm_views.GroupLeaderView.as_view()),

#     # Guides
#     path('all_guides/', data_mgm_views.AllGuides.as_view()),
#     re_path(r'guide/(?P<guide_id>.*)$', data_mgm_views.GuideView.as_view()),

#     # Hotels
#     path('all_hotels/', data_mgm_views.AllHotels.as_view()),
#     re_path(r'hotel/(?P<hotel_id>.*)$', data_mgm_views.HotelView.as_view()),

#     # Parking Lots
#     path('all_parking_lots/', data_mgm_views.AllParkingLots.as_view()),
#     re_path(r'parking_lot/(?P<parking_lot_id>.*)$', data_mgm_views.ParkingLotView.as_view()),

#     # Ports
#     path('all_ports/', data_mgm_views.AllPorts.as_view()),
#     re_path(r'port/(?P<port_id>.*)$', data_mgm_views.PortView.as_view()),

#     # Railway Stations
#     path('all_railway_stations/', data_mgm_views.AllRailwayStations.as_view()),
#     re_path(r'railway_station/(?P<railway_station_id>.*)$', data_mgm_views.RailwayStationView.as_view()),

#     # Repair Shops
#     path('all_repair_shops/', data_mgm_views.AllRepairShops.as_view()),
#     re_path(r'repair_shop/(?P<repair_shop_id>.*)$', data_mgm_views.RepairShopView.as_view()),

#     # Regions
#     path('all_regions/', data_mgm_views.AllRegions.as_view()),
#     re_path(r'region/(?P<rtype>continent|country|state|city|area)/(?P<region_id>.+)$', data_mgm_views.RegionView.as_view()),

#     # Restaurants
#     path('all_restaurants/', data_mgm_views.AllRestaurants.as_view()),
#     re_path(r'restaurant/(?P<restaurant_id>.*)$', data_mgm_views.RestaurantView.as_view()),

#     # Services
#     path('all_services/', data_mgm_views.AllServices.as_view()),
#     re_path(r'service/(?P<service_id>.*)$', data_mgm_views.ServiceView.as_view()),

#     # Sport Event Suppliers
#     path('all_sport_event_suppliers/', data_mgm_views.AllSportEventSuppliers.as_view()),
#     re_path(r'sport_event_supplier/(?P<sport_event_supplier_id>.*)$', data_mgm_views.SportEventSupplierView.as_view()),

#     # Teleferik Companies
#     path('all_teleferik_companies/', data_mgm_views.AllTeleferikCompanies.as_view()),
#     re_path(r'teleferik_company/(?P<teleferik_company_id>.*)$', data_mgm_views.TeleferikCompanyView.as_view()),

#     # Car Hiring Companies
#     path('all_car_hire_companies/', data_mgm_views.AllCarHireCompanies.as_view()),
#     re_path(r'car_hire_company/(?P<car_hire_company_id>.*)$', data_mgm_views.CarHireCompanyView.as_view()),

#     # Advertisement Companies
#     path('all_advertisement_companies/', data_mgm_views.AllAdvertisementCompanies.as_view()),
#     re_path(r'advertisement_company/(?P<advertisement_company_id>.*)$', data_mgm_views.AdvertisementCompanyView.as_view()),

#     # Charter Brokers
#     path('all_charter_brokers/', data_mgm_views.AllCharterBrokers.as_view()),
#     re_path(r'charter_broker/(?P<charter_broker_id>.*)$', data_mgm_views.CharterBrokerView.as_view()),

#     # Aircrafts
#     path('all_aircrafts/', data_mgm_views.AllAircrafts.as_view()),
#     re_path(r'aircraft/(?P<aircraft_id>.*)$', data_mgm_views.AircraftView.as_view()),

#     # Theaters
#     path('all_theaters/', data_mgm_views.AllTheaters.as_view()),
#     re_path(r'theater/(?P<theater_id>.*)$', data_mgm_views.TheaterView.as_view()),

#     # Train Ticket Agencies
#     path('all_train_ticket_agencies/', data_mgm_views.AllTrainTicketAgencies.as_view()),
#     re_path(r'train_ticket_agency/(?P<train_ticket_agency_id>.*)$', data_mgm_views.TrainTicketAgencyView.as_view()),

#     # Text Templates
#     path('all_text_templates/', data_mgm_views.AllTextTemplates.as_view()),
#     re_path(r'text_template/(?P<text_template_id>.*)$', data_mgm_views.TextTemplateView.as_view()),

#     # Entertainment Suppliers
#     path('all_entertainment_suppliers/', data_mgm_views.AllEntertainmentSuppliers.as_view()),
#     re_path(r'entertainment_supplier/(?P<entertainment_supplier_id>.*)$', data_mgm_views.EntertainmentSupplierView.as_view()),

#     # # XHR
#     # For All
#     path('change_name/', data_mgm_xhr.ChangeName.as_view()),
#     path('change_address2/', data_mgm_xhr.ChangeAddress2.as_view()),
#     path('change_address/', data_mgm_xhr.ChangeAddress.as_view()),
#     path('change_email/', data_mgm_xhr.ChangeEmail.as_view()),
#     path('change_postal/', data_mgm_xhr.ChangePostal.as_view()),
#     path('change_date_of_birth/', data_mgm_xhr.ChangeDateOfBirth.as_view()),
#     path('change_tel_details/', data_mgm_xhr.ChangeTelDetails.as_view()),
#     path('change_website/', data_mgm_xhr.ChangeWebsite.as_view()),
#     path('change_enabled/', data_mgm_xhr.ChangeEnabled.as_view()),
#     path('change_abbreviation/', data_mgm_xhr.ChangeAbbreviation.as_view()),
#     path('change_country/', data_mgm_xhr.ChangeCountry.as_view()),
#     path(r'change_latlng/', data_mgm_xhr.ChangeLatLng.as_view()),
#     path(r'change_region/', data_mgm_xhr.ChangeRegion.as_view()),
#     re_path(r'change_rating', data_mgm_xhr.ChangeRating.as_view()),
#     re_path(r'delete_object/(?P<object_id>.*)$', data_mgm_xhr.DeleteObject.as_view()),
#     re_path(r'add_contact_person/(?P<object_id>.)*$', data_mgm_xhr.AddContactPerson.as_view()),
#     re_path(r'delete_contact_person/(?P<object_id>.*)$', data_mgm_xhr.DeleteContactPerson.as_view()),
#     path(r'edit_payment_details/', data_mgm_xhr.EditPaymentDetails.as_view()),
#     re_path(r'delete_hotel_category/', data_mgm_xhr.DeleteHotelCategory.as_view()),
#     re_path(r'delete_product/', data_mgm_xhr.DeleteProduct.as_view()),
#     path('change_priority/', data_mgm_xhr.ChangePriority.as_view()),
#     path('change_hotel_number_of_rooms/', data_mgm_xhr.ChangeHotelNumberOfRooms.as_view()),

#     # Notes
#     re_path(r'add_note/(?P<object_id>.*)$', data_mgm_xhr.AddNote.as_view()),
#     re_path(r'change_note_text/(?P<object_id>.*)$', data_mgm_xhr.ChangeNoteText.as_view()),
#     re_path(r'delete_note/(?P<object_id>.*)$', data_mgm_xhr.DeleteNote.as_view()),

#     # Gallery
#     re_path(r'upload_gallery_image/(?P<object_id>.*)$', data_mgm_xhr.UploadGalleryImage.as_view()),
#     re_path(r'change_gallery_image_caption/(?P<object_id>.*)$', data_mgm_xhr.ChangeGalleryImageCaption.as_view()),
#     re_path(r'delete_gallery_image/(?P<object_id>.*)$', data_mgm_xhr.DeleteGalleryImage.as_view()),

#     # Documents
#     re_path(r'upload_document/(?P<object_id>.*)$', data_mgm_xhr.UploadDocument.as_view()),
#     re_path(r'delete_document/(?P<object_id>.*)$', data_mgm_xhr.DeleteDocument.as_view()),
#     re_path(r'download_document/(?P<object_id>.*)$', data_mgm_xhr.DownloadDocument.as_view()),
#     re_path(r'drag_drop_document/(?P<object_id>.*)$', data_mgm_xhr.DragDropDocument.as_view()),

#     # Specific
#     # Agents
#     path('get_used_icons/', data_mgm_xhr.GetUsedIcons.as_view()),

#     # Attractions
#     path('change_att_type/', data_mgm_xhr.ChangeAttType.as_view()),

#     # Coach Operators
#     re_path(r'update_coach_operator_categories', data_mgm_xhr.UpdateCoachOperatorCategories.as_view()),

#     # Coaches
#     re_path(r'change_make', data_mgm_xhr.ChangeMake.as_view()),
#     re_path(r'change_body_number', data_mgm_xhr.ChangeBodyNumber.as_view()),
#     re_path(r'change_plate_number', data_mgm_xhr.ChangePlateNumber.as_view()),
#     re_path(r'change_number_of_seats', data_mgm_xhr.ChangeNumberOfSeats.as_view()),
#     re_path(r'change_emission', data_mgm_xhr.ChangeEmission.as_view()),
#     re_path(r'change_year', data_mgm_xhr.ChangeYear.as_view()),
#     re_path(r'change_aircraft_year', data_mgm_xhr.ChangeAircraftYear.as_view()),
#     re_path(r'upload_coach_document', data_mgm_xhr.UploadCoachDocument.as_view()),
#     re_path(r'download_coach_document/(?P<coach_id>.*)/$', data_mgm_xhr.DownloadCoachDocument.as_view()),
#     re_path(r'delete_coach_document', data_mgm_xhr.DeleteCoachDocument.as_view()),
#     re_path(r'change_gps_data_sim_card', data_mgm_xhr.ChangeGPSDataSimCard.as_view()),
#     re_path(r'change_imei', data_mgm_xhr.ChangeIMEI.as_view()),

#     # Contracts
#     re_path(r'change_currency', data_mgm_xhr.ChangeCurrency.as_view()),
#     re_path(r'change_period', data_mgm_xhr.ChangePeriod.as_view()),
#     re_path(r'change_status', data_mgm_xhr.ChangeStatus.as_view()),
#     re_path(r'download_contract_document/(?P<contract_id>.*)/$', data_mgm_xhr.DownloadContractDocument.as_view()),
#     re_path(r'upload_contract_document', data_mgm_xhr.UploadContractDocument.as_view()),
#     re_path(r'delete_contract_document', data_mgm_xhr.DeleteContractDocument.as_view()),
#     re_path(r'stop_sales', data_mgm_xhr.StopSales.as_view()),
#     re_path(r'change_release_period', data_mgm_xhr.ChangeReleasePeriod.as_view()),
#     re_path(r'change_cancellation_limit', data_mgm_xhr.ChangeCancellationLimit.as_view()),
#     re_path(r'change_cancellation_charge', data_mgm_xhr.ChangeCancellationCharge.as_view()),
#     re_path(r'change_infant_age', data_mgm_xhr.ChangeInfantAge.as_view()),
#     re_path(r'change_child_age', data_mgm_xhr.ChangeChildAge.as_view()),
#     re_path(r'change_pricing', data_mgm_xhr.ChangePricing.as_view()),
#     re_path(r'change_inclusive_board', data_mgm_xhr.ChangeInclusiveBoard.as_view()),
#     re_path(r'change_city_taxes', data_mgm_xhr.ChangeCityTaxes.as_view()),

#     # Contract Rooms
#     re_path(r'change_number_of_rooms', data_mgm_xhr.ChangeNumberOfRooms.as_view()),

#     # Hotels
#     re_path(r'update_amenities', data_mgm_xhr.UpdateAmenities.as_view()),
#     re_path(r'change_price', data_mgm_xhr.ChangePrice.as_view()),
#     re_path(r'update_hotel_categories', data_mgm_xhr.UpdateHotelCategories.as_view()),
#     re_path(r'change_hotel_price', data_mgm_xhr.ChangeHotelPrice.as_view()),

#     # Ferry Ticket Agencies
#     re_path(r'add_route', data_mgm_xhr.AddRoute.as_view()),
#     re_path(r'delete_route', data_mgm_xhr.DeleteRoute.as_view()),

#     # Guides
#     re_path(r'change_guide_languages', data_mgm_xhr.ChangeGuideLanguages.as_view()),

#     # Group Leader
#     re_path(r'change_group_leader_languages', data_mgm_xhr.ChangeGroupLeaderLanguages.as_view()),

#     # Destination Management Companies
#     re_path(r'change_dmc_languages', data_mgm_xhr.ChangeDmcLanguages.as_view()),

#     # Drivers
#     re_path(r'upload_driver_document', data_mgm_xhr.UploadDriverDocument.as_view()),
#     re_path(r'download_driver_document/(?P<driver_id>.*)/$', data_mgm_xhr.DownloadDriverDocument.as_view()),
#     re_path(r'delete_driver_document', data_mgm_xhr.DeleteDriverDocument.as_view()),

#     # Regions
#     re_path(r'change_markup/(?P<rtype>continent|country|state|city|area)/(?P<region_id>.+)$', data_mgm_xhr.ChangeMarkup.as_view()),
#     re_path(r'change_parent_region', data_mgm_xhr.ChangeParentRegion.as_view()),

#     # Repair Shop
#     re_path(r'change_repair_shop_type', data_mgm_xhr.ChangeRepairShopType.as_view()),

#     # Restaurant
#     re_path(r'change_restaurant_type', data_mgm_xhr.ChangeRestaurantType.as_view()),
#     re_path(r'upload_restaurant_menu', data_mgm_xhr.UploadRestaurantMenu.as_view()),
#     re_path(r'delete_restaurant_menu', data_mgm_xhr.DeleteRestaurantMenu.as_view()),
#     re_path(r'download_restaurant_menu/(?P<restaurant_id>.*)/$', data_mgm_xhr.DownloadRestaurantMenu.as_view()),
#     re_path(r'change_capacity', data_mgm_xhr.ChangeCapacity.as_view()),

#     re_path(r'change_menu_description', data_mgm_xhr.ChangeMenuDescription.as_view()),
#     re_path(r'change_menu_price', data_mgm_xhr.ChangeMenuPrice.as_view()),

#     # Ports
#     re_path(r'change_code', data_mgm_xhr.ChangeCode.as_view()),

#     # Railway Station
#     re_path(r'change_railway_station_code', data_mgm_xhr.ChangeRailwayStationCode.as_view()),

#     # Airports
#     re_path(r'change_location', data_mgm_xhr.ChangeLocation.as_view()),
#     re_path(r'add_terminal', data_mgm_xhr.AddTerminal.as_view()),
#     re_path(r'delete_terminal', data_mgm_xhr.DeleteTerminal.as_view()),
#     re_path(r'update_airport_distance', data_mgm_xhr.UpdateAirportDistance.as_view()),

#     # Text Templates
#     re_path(r'change_template_text', data_mgm_xhr.ChangeTemplateText.as_view()),
#     re_path(r'change_template_type', data_mgm_xhr.ChangeTemplateType.as_view()),
#     re_path(r'change_template_countries', data_mgm_xhr.ChangeTemplateCountries.as_view()),

#     # Agents
#     re_path(r'change_bus_icon', data_mgm_xhr.ChangeBusIcon.as_view()),

#     # Entertainment Products
#     re_path(r'change_product_description', data_mgm_xhr.ChangeProductDescription.as_view()),

#     # Reorder Photos
#     re_path(r'reorder_photos', data_mgm_xhr.ReorderPhotos.as_view()),

# ]
