# from .models import (
#     CoachOperator,
#     GroupTransfer,
#     Country,
#     Continent,
#     Agent,
#     FerryTicketAgency,
#     TravelDay,
#     Note,
#     Offer,
#     Client,
#     Airport,
#     Restaurant,
#     Terminal,
#     Contact,
#     Hotel,
#     Coach,
#     Document,
#     DocRoomingList,
#     Amenity,
#     Photo,
#     RepairShop,
#     RepairType,
#     Airline,
#     Attraction,
#     AttractionEntries,
#     Guide,
#     Port,
#     Theater,
#     SportEventSupplier,
#     CruisingCompany,
#     TeleferikCompany,
#     DMC,
#     TrainTicketAgency,
#     Service,
#     TextTemplate,
#     RestaurantType,
#     Room,
#     RailwayStation,
#     RestaurantMenu,
#     Contract,
#     Night,
#     ParkingLot,
#     Payment,
#     TextTemplateCountry,
#     PaymentDetails,
#     HotelCategory,
#     CoachOperatorCategory,
#     Deposit,
#     PaymentOrder,
#     State,
#     City,
#     Area,
#     Proforma,
#     FerryRoute,
#     EntertainmentSupplier,
#     EntertainmentProduct,
#     CarHireCompany,
#     AdvertisementCompany,
#     CharterBroker,
#     Aircraft,
# )

# from rest_framework import serializers
# from accounts.serializers import UserSerializer


# class ContinentSerializer(serializers.ModelSerializer):

#     class Meta:
#         many = False
#         model = Continent
#         fields = '__all__'


# class CountrySerializer(serializers.ModelSerializer):
#     continent = ContinentSerializer()

#     class Meta:
#         many = False
#         model = Country
#         fields = '__all__'


# class StateSerializer(serializers.ModelSerializer):
#     country = CountrySerializer()

#     class Meta:
#         many = False
#         model = State
#         fields = '__all__'


# class CitySerializer(serializers.ModelSerializer):
#     state = StateSerializer()
#     country = CountrySerializer()

#     class Meta:
#         many = False
#         model = City
#         fields = '__all__'


# class AreaSerializer(serializers.ModelSerializer):
#     city = CitySerializer()

#     class Meta:
#         many = False
#         model = Area
#         fields = '__all__'


# class NoteSerializer(serializers.ModelSerializer):
#     user = UserSerializer()

#     class Meta:
#         many = True
#         model = Note
#         fields = '__all__'


# class DocumentSerializer(serializers.ModelSerializer):
#     uploader = UserSerializer()

#     class Meta:
#         many = True
#         model = Document
#         fields = '__all__'


# class TerminalSerializer(serializers.ModelSerializer):

#     class Meta:
#         many = True
#         model = Terminal
#         fields = '__all__'


# class AmenitiesSerializer(serializers.ModelSerializer):

#     class Meta:
#         many = True
#         model = Amenity
#         fields = '__all__'


# class PhotoSerializer(serializers.ModelSerializer):

#     class Meta:
#         many = True
#         model = Photo
#         fields = '__all__'


# class PaymentDetailsSerializer(serializers.ModelSerializer):

#     class Meta:
#         many = True
#         model = PaymentDetails
#         fields = '__all__'


# class ContactSerializer(serializers.ModelSerializer):
#     documents = DocumentSerializer(many=True)
#     photos = PhotoSerializer(many=True)
#     notes = NoteSerializer(many=True)
#     flags = CountrySerializer(many=True)
#     payment_details = PaymentDetailsSerializer()

#     class Meta:
#         many = True
#         model = Contact
#         fields = '__all__'


# class AttractionSerializer(serializers.ModelSerializer):
#     contact = ContactSerializer()
#     photos = PhotoSerializer(many=True)
#     notes = NoteSerializer(many=True)
#     documents = DocumentSerializer(many=True)

#     class Meta:
#         many = False
#         model = Attraction
#         fields = '__all__'


# class RoomSerializer(serializers.ModelSerializer):

#     class Meta:
#         many = True
#         model = Room
#         fields = '__all__'


# class CoachOperatorCategorySerializer(serializers.ModelSerializer):

#     class Meta:
#         many = True
#         model = CoachOperatorCategory
#         fields = '__all__'


# class HotelCategorySerializer(serializers.ModelSerializer):

#     class Meta:
#         many = True
#         model = HotelCategory
#         fields = '__all__'


# class HotelSerializer(serializers.ModelSerializer):
#     contact = ContactSerializer()
#     amenity = AmenitiesSerializer()
#     notes = NoteSerializer(many=True)
#     photos = PhotoSerializer(many=True)
#     payment_details = PaymentDetailsSerializer()
#     categories = HotelCategorySerializer(many=True)
#     contact_persons = ContactSerializer(many=True)
#     documents = DocumentSerializer(many=True)

#     class Meta:
#         many = True
#         model = Hotel
#         fields = '__all__'


# class ReportsHotelSerializer(serializers.ModelSerializer):
#     class Meta:
#         many = True
#         model = Hotel
#         fields = ['id', 'name']


# class ClientSerializer(serializers.ModelSerializer):
#     contact = ContactSerializer()
#     nationality = CountrySerializer()
#     notes = NoteSerializer(many=True)
#     photos = PhotoSerializer(many=True)
#     contact_persons = ContactSerializer(many=True)
#     payment_details = PaymentDetailsSerializer()
#     documents = DocumentSerializer(many=True)

#     class Meta:
#         many = True
#         model = Client
#         fields = '__all__'


# class RoomingListSerializer(serializers.ModelSerializer):
#     doc_From = ContactSerializer()
#     doc_To = ContactSerializer()
#     hotel = HotelSerializer()
#     doc_Attn = ContactSerializer()

#     class Meta:
#         many = False
#         model = DocRoomingList
#         fields = '__all__'



# class UnnestedAgentSerializer(serializers.ModelSerializer):
    
#     class Meta:
#         many = True
#         model = Agent
#         fields = '__all__'


# class AgentSerializer(serializers.ModelSerializer):
#     contact = ContactSerializer()
#     nationality = CountrySerializer()
#     notes = NoteSerializer(many=True)
#     photos = PhotoSerializer(many=True)
#     contact_persons = ContactSerializer(many=True)
#     payment_details = PaymentDetailsSerializer()
#     documents = DocumentSerializer(many=True)

#     class Meta:
#         many = True
#         model = Agent
#         fields = '__all__'


# class CoachOperatorSerializer(serializers.ModelSerializer):
#     contact = ContactSerializer()
#     notes = NoteSerializer(many=True)
#     photos = PhotoSerializer(many=True)
#     contact_persons = ContactSerializer(many=True)
#     payment_details = PaymentDetailsSerializer()
#     categories = CoachOperatorCategorySerializer(many=True)
#     documents = DocumentSerializer(many=True)

#     class Meta:
#         model = CoachOperator
#         fields = "__all__"


# class ReportsCoachOperatorSerializer(serializers.ModelSerializer):

#     class Meta:
#         model = CoachOperator
#         fields = ['id', 'name']


# class CoachSerializer(serializers.ModelSerializer):
#     coach_operator = CoachOperatorSerializer(many=False)
#     notes = NoteSerializer(many=True)
#     photos = PhotoSerializer(many=True)
#     documents = DocumentSerializer(many=True)

#     class Meta:
#         many = True
#         model = Coach
#         fields = '__all__'


# class RepairTypeSerializer(serializers.ModelSerializer):

#     class Meta:
#         many = True
#         model = RepairType
#         fields = '__all__'


# class RepairShopSerializer(serializers.ModelSerializer):
#     contact = ContactSerializer()
#     notes = NoteSerializer(many=True)
#     type = RepairTypeSerializer(many=True)
#     contact_persons = ContactSerializer(many=True)
#     payment_details = PaymentDetailsSerializer()
#     documents = DocumentSerializer(many=True)

#     class Meta:
#         many = True
#         model = RepairShop
#         fields = '__all__'


# class RestaurantTypeSerializer(serializers.ModelSerializer):

#     class Meta:
#         many = True
#         model = RestaurantType
#         fields = '__all__'


# class GuideSerializer(serializers.ModelSerializer):
#     contact = ContactSerializer()
#     notes = NoteSerializer(many=True)
#     photos = PhotoSerializer(many=True)
#     flags = CountrySerializer(many=True)
#     payment_details = PaymentDetailsSerializer()
#     documents = DocumentSerializer(many=True)

#     class Meta:
#         many = True
#         model = Guide
#         fields = '__all__'


# class TempGroupSerializer(serializers.ModelSerializer):
#     agent = AgentSerializer()
#     client = ClientSerializer()

#     class Meta:
#         model = GroupTransfer
#         fields = "__all__"


# class RestaurantMenuSerializer(serializers.ModelSerializer):
#     file = DocumentSerializer()

#     class Meta:
#         many = True
#         model = RestaurantMenu
#         fields = '__all__'


# class RestaurantSerializer(serializers.ModelSerializer):
#     contact = ContactSerializer()
#     notes = NoteSerializer(many=True)
#     photos = PhotoSerializer(many=True)
#     type = RepairTypeSerializer(many=True)
#     contact_persons = ContactSerializer(many=True)
#     restaurant_menu = RestaurantMenuSerializer(many=True)
#     payment_details = PaymentDetailsSerializer()
#     documents = DocumentSerializer(many=True)

#     class Meta:
#         many = False
#         model = Restaurant
#         fields = '__all__'


# class TheaterSerializer(serializers.ModelSerializer):
#     contact = ContactSerializer()
#     notes = NoteSerializer(many=True)
#     photos = PhotoSerializer(many=True)
#     contact_persons = ContactSerializer(many=True)
#     payment_details = PaymentDetailsSerializer()
#     documents = DocumentSerializer(many=True)

#     class Meta:
#         many = False
#         model = Theater
#         fields = '__all__'


# class SportEventSupplierSerializer(serializers.ModelSerializer):
#     contact = ContactSerializer()
#     photos = PhotoSerializer(many=True)
#     contact_persons = ContactSerializer(many=True)
#     payment_details = PaymentDetailsSerializer()
#     documents = DocumentSerializer(many=True)

#     class Meta:
#         many = False
#         model = SportEventSupplier
#         fields = '__all__'


# class PortSerializer(serializers.ModelSerializer):
#     nationality = CountrySerializer()

#     class Meta:
#         many = False
#         model = Port
#         fields = '__all__'


# class RailwayStationSerializer(serializers.ModelSerializer):
#     nationality = CountrySerializer()

#     class Meta:
#         many = False
#         model = RailwayStation
#         fields = '__all__'


# class FerryRouteSerializer(serializers.ModelSerializer):

#     class Meta:
#         many = True
#         model = FerryRoute
#         fields = '__all__'


# class FerryTicketAgencySerializer(serializers.ModelSerializer):
#     ferry_ticket_agency_route = FerryRouteSerializer(many=True)
#     contact = ContactSerializer()
#     contact_persons = ContactSerializer(many=True)
#     documents = DocumentSerializer(many=True)
#     payment_details = PaymentDetailsSerializer()

#     class Meta:
#         many = False
#         model = FerryTicketAgency
#         fields = '__all__'


# class TrainTicketAgencySerializer(serializers.ModelSerializer):
#     contact = ContactSerializer()
#     contact_persons = ContactSerializer(many=True)
#     payment_details = PaymentDetailsSerializer()
#     documents = DocumentSerializer(many=True)

#     class Meta:
#         many = False
#         model = TrainTicketAgency
#         fields = '__all__'


# class CruisingCompanySerializer(serializers.ModelSerializer):
#     contact = ContactSerializer()
#     contact_persons = ContactSerializer(many=True)
#     payment_details = PaymentDetailsSerializer()
#     documents = DocumentSerializer(many=True)

#     class Meta:
#         many = False
#         model = CruisingCompany
#         fields = '__all__'


# class DMCSerializer(serializers.ModelSerializer):
#     contact = ContactSerializer()
#     countries_operating = CountrySerializer(many=True)
#     contact_persons = ContactSerializer(many=True)
#     payment_details = PaymentDetailsSerializer()
#     notes = NoteSerializer(many=True)
#     documents = DocumentSerializer(many=True)

#     class Meta:
#         many = False
#         model = DMC
#         fields = '__all__'


# class TeleferikCompanySerializer(serializers.ModelSerializer):
#     contact = ContactSerializer()
#     contact_persons = ContactSerializer(many=True)
#     payment_details = PaymentDetailsSerializer()
#     documents = DocumentSerializer(many=True)

#     class Meta:
#         many = False
#         model = TeleferikCompany
#         fields = '__all__'


# class AirlineSerializer(serializers.ModelSerializer):
#     payment_details = PaymentDetailsSerializer()

#     class Meta:
#         many = False
#         model = Airline
#         fields = '__all__'


# class AirportSerializer(serializers.ModelSerializer):
#     airport_terminal = TerminalSerializer(many=True)

#     class Meta:
#         many = True
#         model = Airport
#         fields = '__all__'


# class EntertainmentProductSerializer(serializers.ModelSerializer):

#     class Meta:
#         many = True
#         model = EntertainmentProduct
#         fields = '__all__'


# class EntertainmentSupplierSerializer(serializers.ModelSerializer):
#     contact = ContactSerializer()
#     photos = PhotoSerializer(many=True)
#     notes = NoteSerializer(many=True)
#     contact_persons = ContactSerializer(many=True)
#     payment_details = PaymentDetailsSerializer()
#     entertainment_supplier_product = EntertainmentProductSerializer(many=True)
#     documents = DocumentSerializer(many=True)

#     class Meta:
#         many = False
#         model = EntertainmentSupplier
#         fields = '__all__'


# class ServiceSerializer(serializers.ModelSerializer):
#     hotel = HotelSerializer()
#     restaurant = RestaurantSerializer()
#     airline = AirlineSerializer()
#     dmc = DMCSerializer()
#     ferry_ticket_agency = FerryTicketAgencySerializer()
#     cruising_company = CruisingCompanySerializer()
#     guide = GuideSerializer()
#     tour_leader = ContactSerializer()
#     sport_event_supplier = SportEventSupplierSerializer()
#     teleferik_company = TeleferikCompanySerializer()
#     theater = TheaterSerializer()
#     train_ticket_agency = TrainTicketAgencySerializer()
#     coach_operator = CoachOperatorSerializer()
#     entertainment_supplier = EntertainmentSupplierSerializer()

#     class Meta:
#         many = True
#         model = Service
#         fields = '__all__'


# class AttractionEntrySerializer(serializers.ModelSerializer):
#     attraction = AttractionSerializer()

#     class Meta:
#         many = False
#         model = AttractionEntries
#         fields = '__all__'


# class TempTravelDaySerializer(serializers.ModelSerializer):
#     hotel = HotelSerializer(many=False)
#     group_transfer = TempGroupSerializer()

#     class Meta:
#         many = True
#         model = TravelDay
#         fields = '__all__'


# class PaymentSerializer(serializers.ModelSerializer):
#     group_transfer = TempGroupSerializer()
#     invoice = DocumentSerializer()
#     proforma = DocumentSerializer()

#     class Meta:
#         model = Payment
#         fields = "__all__"
#         ordering = ['pay_until']


# class DepositSerializer(serializers.ModelSerializer):
#     payment = PaymentSerializer()

#     class Meta:
#         model = Deposit
#         fields = '__all__'


# class ProformaSerializer(serializers.ModelSerializer):

#     class Meta:
#         model = Proforma
#         fields = '__all__'


# class PaymentOrderSerializer(serializers.ModelSerializer):
#     deposits = DepositSerializer(many=True)

#     class Meta:
#         many = True
#         model = PaymentOrder
#         fields = '__all__'


# class TravelDaySerializer(serializers.ModelSerializer):
#     group_transfer = TempGroupSerializer()
#     travelday_service = ServiceSerializer(many=True)
#     travelday_attraction = AttractionEntrySerializer(many=True)
#     hotel = HotelSerializer(many=False)
#     driver = ContactSerializer(many=False)
#     leader = ContactSerializer(many=False)
#     coach = CoachSerializer(many=False)
#     booker = UserSerializer(many=False)

#     class Meta:
#         many = True
#         model = TravelDay
#         fields = '__all__'


# class GroupSerializer(serializers.ModelSerializer):
#     group_travelday = TravelDaySerializer(many=True)
#     group_payment = PaymentSerializer(many=True)
#     nationality = CountrySerializer()
#     agent = AgentSerializer()
#     client = ClientSerializer()
#     notes = NoteSerializer(many=True)
#     documents = DocumentSerializer(many=True)
#     rooming_lists = RoomingListSerializer(many=True)
#     proforma = ProformaSerializer(many=False)

#     class Meta:
#         model = GroupTransfer
#         fields = "__all__"


# class GroupStatsSerializer(serializers.ModelSerializer):

#     class Meta:
#         model = GroupTransfer
#         fields = "__all__"


# class TextTemplateCountrySerializer(serializers.ModelSerializer):

#     class Meta:
#         many = True
#         model = TextTemplateCountry
#         fields = '__all__'


# class TextTemplateSerializer(serializers.ModelSerializer):

#     countries = TextTemplateCountrySerializer(many=True)

#     class Meta:
#         many = True
#         model = TextTemplate
#         fields = '__all__'


# class NightSerializer(serializers.ModelSerializer):

#     class Meta:
#         many = True
#         model = Night
#         fields = '__all__'


# class OfferSerializer(serializers.ModelSerializer):
#     recipient = AgentSerializer()
#     services = ServiceSerializer(many=True)
#     text_templates = TextTemplateSerializer(many=True)
#     nights = NightSerializer(many=True)

#     class Meta:
#         many = True
#         model = Offer
#         fields = '__all__'


# class LeaderSerializer(serializers.ModelSerializer):
#     flags = CountrySerializer(many=True)

#     class Meta:
#         many = True
#         model = Contact
#         fields = ['id', 'name', 'rating', 'flags']


# class ContractSerializer(serializers.ModelSerializer):
#     document = DocumentSerializer()
#     agent = AgentSerializer()
#     airline = AirlineSerializer()
#     coach_operator = CoachOperatorSerializer()
#     dmc = DMCSerializer()
#     ferry_ticket_agency = FerryTicketAgencySerializer()
#     cruising_company = CruisingCompanySerializer()
#     hotel = HotelSerializer()
#     sport_event_supplier = SportEventSupplierSerializer()
#     theater = TheaterSerializer()
#     train_ticket_agency = TrainTicketAgencySerializer()
#     room_contract = RoomSerializer(many=True)

#     class Meta:
#         many = True
#         model = Contract
#         fields = '__all__'


# class ParkingLotSerializer(serializers.ModelSerializer):
#     contact = ContactSerializer()
#     notes = NoteSerializer(many=True)
#     photos = PhotoSerializer(many=True)

#     class Meta:
#         model = ParkingLot
#         fields = '__all__'


# class CarHireCompanySerializer(serializers.ModelSerializer):
#     contact = ContactSerializer()
#     contact_persons = ContactSerializer(many=True)
#     payment_details = PaymentDetailsSerializer()
#     documents = DocumentSerializer(many=True)

#     class Meta:
#         model = CarHireCompany
#         fields = '__all__'


# class AdvertisementCompanySerializer(serializers.ModelSerializer):
#     contact = ContactSerializer()
#     contact_persons = ContactSerializer(many=True)
#     payment_details = PaymentDetailsSerializer()
#     documents = DocumentSerializer(many=True)

#     class Meta:
#         model = AdvertisementCompany
#         fields = '__all__'


# class CharterBrokerSerializer(serializers.ModelSerializer):
#     contact = ContactSerializer()
#     contact_persons = ContactSerializer(many=True)
#     payment_details = PaymentDetailsSerializer()
#     documents = DocumentSerializer(many=True)

#     class Meta:
#         model = CharterBroker
#         fields = '__all__'


# class AircraftSerializer(serializers.ModelSerializer):
#     charter_broker = CharterBrokerSerializer(many=False)

#     class Meta:
#         model = Aircraft
#         fields = '__all__'
