from django.urls import path, re_path
from webapp.groups import views as group_views
from webapp.groups import (
    group_overview,
    schedule,
    services,
    payments,
    itinerary,
    rooming_lists,
    documents,
    offer_overview,
    proforma,
)

from webapp import create


urlpatterns = [

    # # # Views
    path('all_groups/', group_views.AllGroups.as_view()),
    re_path(r'group/(?P<refcode>.*)$', group_views.GroupView.as_view()),
    re_path('rooming_list_view/(?P<refcode>.*)$', group_views.RoomingListView.as_view()),
    re_path(r'offer/(?P<offer_id>.*)$', group_views.OfferView.as_view()),
    path('all_group_offers/', group_views.AllGroupOffers.as_view()),
    path('coach_availability/', group_views.CoachAvailability.as_view()),
    path('get_coach_heatmap/', group_views.GetCoachHeatmap.as_view()),
    path('driver_availability/', group_views.DriverAvailability.as_view()),
    path('get_driver_heatmap/', group_views.GetDriverHeatmap.as_view()),
    path('pending_groups/', group_views.PendingGroups.as_view()),

    # All groups
    re_path(r'add_group', create.AddGroup.as_view()),

    # Group Overview
    re_path(r'change_refcode/(?P<refcode>.*)$', group_overview.ChangeRefcode.as_view()),
    re_path(r'change_status/(?P<refcode>.*)$', group_overview.ChangeStatus.as_view()),
    re_path(r'change_arrival_flight/(?P<refcode>.*)$', group_overview.ChangeArrivalFlight.as_view()),
    re_path(r'change_departure_flight/(?P<refcode>.*)$', group_overview.ChangeDepartureFlight.as_view()),
    re_path(r'change_number_of_people/(?P<refcode>.*)$', group_overview.ChangeNumberOfPeople.as_view()),
    re_path(r'change_room_desc/(?P<refcode>.*)$', group_overview.ChangeRoomDesc.as_view()),
    re_path(r'change_meal_desc/(?P<refcode>.*)$', group_overview.ChangeMealDesc.as_view()),
    re_path(r'change_groups_agent/(?P<refcode>.*)$', group_overview.ChangeGroupsAgent.as_view()),
    re_path(r'change_groups_client/(?P<refcode>.*)$', group_overview.ChangeGroupsClient.as_view()),
    re_path(r'change_agents_refcode/(?P<refcode>.*)$', group_overview.ChangeAgentsRefcode.as_view()),
    re_path(r'change_clients_refcode/(?P<refcode>.*)$', group_overview.ChangeClientsRefcode.as_view()),
    re_path(r'change_employee_info/(?P<refcode>.*)$', group_overview.ChangeEmployeeInfo.as_view()),
    re_path(r'del_grp/(?P<refcode>.*)$', group_overview.DeleteGroup.as_view()),
    re_path(r'reset_itinerary_download/(?P<refcode>.*)$', group_overview.ResetItineraryDownload.as_view()),

    # Schedule
    re_path(r'add_new_travelday/(?P<refcode>.*)$', schedule.AddNewTravelday.as_view()),
    re_path(r'delete_travelday/(?P<refcode>.*)$', schedule.DeleteTravelday.as_view()),
    re_path(r'delete_schedule/(?P<refcode>.*)$', schedule.DeleteSchedule.as_view()),
    re_path(r'change_travelday_date/$', schedule.ChangeTraveldayDate.as_view()),
    re_path(r'check_for_date_conflict/(?P<refcode>.*)$', schedule.CheckForDateConflict.as_view()),
    re_path(r'change_hotel/(?P<refcode>.*)$', schedule.ChangeHotel.as_view()),
    re_path(r'change_driver/(?P<refcode>.*)$', schedule.ChangeDriver.as_view()),
    re_path(r'check_for_driver_conflict/(?P<refcode>.*)$', schedule.CheckForDriverConflict.as_view()),
    re_path(r'change_coach/(?P<refcode>.*)$', schedule.ChangeCoach.as_view()),
    re_path(r'check_for_coach_conflict/(?P<refcode>.*)$', schedule.CheckForCoachConflict.as_view()),
    re_path(r'change_group_leader/$', schedule.ChangeGroupLeader.as_view()),
    re_path(r'change_option_date/(?P<refcode>.*)$', schedule.ChangeOptionDate.as_view()),

    # Services
    re_path(r'delete_service/(?P<refcode>.*)$', services.DeleteService.as_view()),
    re_path(r'delete_all_services/(?P<refcode>.*)$', services.DeleteAllServices.as_view()),
    re_path(r'create_travelday_service/$', services.AddNewService.as_view()),
    re_path(r'change_date', services.ChangeDate.as_view()),
    re_path(r'change_price', services.ChangePrice.as_view()),
    re_path(r'change_description', services.ChangeDescription.as_view()),

    # Payments
    re_path(r'add_pending_payment', payments.AddPendingPayment.as_view()),
    re_path(r'delete_payment', payments.DeletePayment.as_view()),
    re_path(r'download_financial_document', payments.DownloadFinancialDocument.as_view()),
    re_path(r'get_group_deposits/(?P<refcode>.*)$', payments.GetGroupDeposits.as_view()),
    re_path(r'upload_payment_document', payments.uploadPaymentDocument.as_view()),

    #  Itinerary
    re_path('download_itinerary_pdf/(?P<refcode>.*)$', itinerary.DownloadItinerary.as_view()),
    re_path('toggle_travelday_attraction/$', itinerary.ToggleTravelDayAttraction.as_view()),
    re_path('change_attraction_time/$', itinerary.ChangeAttractionTime.as_view()),
    re_path('update_group_roomtext/(?P<refcode>.*)$', itinerary.UpdateGroupRoomtext.as_view()),
    re_path('update_group_remarks/(?P<refcode>.*)$', itinerary.UpdateGroupRemarks.as_view()),
    re_path('add_attraction_to_travelday/$', itinerary.AddAttractionToTravelday.as_view()),
    re_path('change_travelday_comment/$', itinerary.ChangeTraveldayComment.as_view()),
    re_path('download_itinerary_uk/(?P<refcode>.*)$', itinerary.DownloadItineraryUK.as_view()),

    # Rooming lists
    re_path('change_rooming_list_room_text/(?P<refcode>.*)$', rooming_lists.ChangeRoomingListRoomText.as_view()),
    re_path('change_rooming_list_room_description/(?P<refcode>.*)$', rooming_lists.ChangeRoomingListRoomDescr.as_view()),
    re_path('change_rooming_list_meal_description/(?P<refcode>.*)$', rooming_lists.ChangeRoomingListMealDescr.as_view()),
    re_path('change_rooming_list_note/(?P<refcode>.*)$', rooming_lists.ChangeRoomingListNote.as_view()),
    re_path('edit_mass_rooming_list_fields/(?P<refcode>.*)$', rooming_lists.EditMassRoomingListFields.as_view()),
    re_path('send_all_rooming_lists/(?P<refcode>.*)$', rooming_lists.SendAllRoomingLists.as_view()),
    re_path('send_rooming_list/(?P<refcode>.*)$', rooming_lists.SendRoomingList.as_view()),
    re_path('toggle_checkmark/', rooming_lists.ToggleCheckmark.as_view()),

    # Documents
    re_path(r'upload_group_document/(?P<refcode>.*)$', documents.UploadGroupDocument.as_view()),
    re_path(r'download_group_document/(?P<refcode>.*)/$', documents.DownloadGroupDocument.as_view()),
    re_path(r'delete_group_document/(?P<refcode>.*)$', documents.DeleteGroupDocument.as_view()),
    re_path(r'drag_drop_group_document/(?P<refcode>.*)$', documents.DragDropGroupDocument.as_view()),
    re_path(r'download_rooming_list/(?P<refcode>.*)$', documents.DownloadRoomingList.as_view()),
    re_path(r'download_cabin_list/(?P<refcode>.*)$', documents.DownloadCabinList.as_view()),

    # Proforma
    re_path(r'create_proforma/', proforma.CreateProforma.as_view()),
    re_path(r'change_proforma_date/(?P<refcode>.*)$', proforma.ChangeProformaDate.as_view()),
    re_path(r'change_proforma_payable_until/(?P<refcode>.*)$', proforma.ChangeProformaPayableUntil.as_view()),
    re_path(r'change_proforma_banks/(?P<refcode>.*)$', proforma.ChangeProformaBanks.as_view()),
    re_path('download_proforma_pdf/(?P<refcode>.*)$', proforma.DownloadProforma.as_view()),
    re_path('send_proforma/', proforma.SendProforma.as_view()),
    re_path(r'issue_proforma/(?P<refcode>.*)$', proforma.IssueProforma.as_view()),
    re_path(r'cancel_proforma/(?P<refcode>.*)$', proforma.CancelProforma.as_view()),

    # All Offers
    re_path(r'add_offer', create.AddOffer.as_view()),

    # Offer Overview
    re_path(r'update_offer_info/(?P<offer_id>.*)$', offer_overview.ChangeOfferInfo.as_view()),
    re_path(r'add_off_service/(?P<offer_id>.*)$', offer_overview.AddOfferService.as_view()),
    re_path(r'delete_offer_service/$', offer_overview.DeleteOfferService.as_view()),
    re_path(r'change_offer_service_price/$', offer_overview.ChangeOfferServicePrice.as_view()),
    re_path(r'delete_all_offer_services/(?P<offer_id>.*)$', offer_overview.DeleteAllOfferServices.as_view()),
    re_path(r'change_offer_recipient/(?P<offer_id>.*)$', offer_overview.ChangeOfferRecipient.as_view()),
    re_path(r'change_offer_period/(?P<offer_id>.*)$', offer_overview.ChangeOfferPeriod.as_view()),
    re_path(r'edit_offer_nights/(?P<offer_id>.*)$', offer_overview.EditOfferNights.as_view()),
    re_path('download_offer_pdf/(?P<offer_id>.*)$', offer_overview.DownloadOfferPDF.as_view()),

    # Offer Templates
    re_path(r'update_offer_templates/(?P<offer_id>.*)$', offer_overview.UpdateOfferTemplates.as_view()),
    re_path(r'update_all_offer_templates/(?P<offer_id>.*)$', offer_overview.UpdateAllOfferTemplates.as_view()),
    re_path(r'toggle_offer_template_by_search/(?P<offer_id>.*)$', offer_overview.ToggleOfferTemplateBySearch.as_view()),

]
