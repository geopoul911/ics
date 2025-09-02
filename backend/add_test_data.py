#!/usr/bin/env python
import os
import sys
import django

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.utils import timezone
from accounts.models import Consultant
from webapp.models import (
    Country, Province, City, Bank, InsuranceCarrier,
    Profession, Professional,
    Client, BankClientAccount,
    ProjectCategory, Project, AssociatedClient,
    Document, Property, BankProjectAccount,
    TaskCategory, ProjectTask, TaskComment,
    Cash, TaxationProject
)

def add_test_data():
    print("=== Adding Test Data ===")
    
    # Add countries
    countries_data = [
        {'country_id': 'CA', 'title': 'CANADA', 'currency': 'CAD', 'orderindex': 10},
        {'country_id': 'US', 'title': 'UNITED STATES', 'currency': 'USD', 'orderindex': 20},
        {'country_id': 'UK', 'title': 'UNITED KINGDOM', 'currency': 'GBP', 'orderindex': 30},
    ]
    
    for country_data in countries_data:
        country, created = Country.objects.get_or_create(
            country_id=country_data['country_id'],
            defaults=country_data
        )
        if created:
            print(f"Created country: {country.title}")
        else:
            print(f"Country already exists: {country.title}")
    
    # Add provinces for Canada
    canada = Country.objects.get(country_id='CA')
    provinces_data = [
        {'province_id': 'ON', 'title': 'ONTARIO', 'country': canada, 'orderindex': 10},
        {'province_id': 'BC', 'title': 'BRITISH COLUMBIA', 'country': canada, 'orderindex': 20},
        {'province_id': 'AB', 'title': 'ALBERTA', 'country': canada, 'orderindex': 30},
    ]
    
    for province_data in provinces_data:
        province, created = Province.objects.get_or_create(
            province_id=province_data['province_id'],
            defaults=province_data
        )
        if created:
            print(f"Created province: {province.title} in {province.country.title}")
        else:
            print(f"Province already exists: {province.title}")
    
    # Add cities
    ontario = Province.objects.get(province_id='ON')
    cities_data = [
        {'city_id': 'TOR', 'title': 'TORONTO', 'country': canada, 'province': ontario, 'orderindex': 10},
        {'city_id': 'OTT', 'title': 'OTTAWA', 'country': canada, 'province': ontario, 'orderindex': 20},
    ]
    
    for city_data in cities_data:
        city, created = City.objects.get_or_create(
            city_id=city_data['city_id'],
            defaults=city_data
        )
        if created:
            print(f"Created city: {city.title} in {city.province.title}, {city.country.title}")
        else:
            print(f"City already exists: {city.title}")

    # Banks
    banks_data = [
        {"bank_id": "BMO", "bankname": "Bank of Montreal", "country": canada, "orderindex": 10, "institutionnumber": "001", "swiftcode": "BMOCCATT"},
        {"bank_id": "RBC", "bankname": "Royal Bank", "country": canada, "orderindex": 20, "institutionnumber": "003", "swiftcode": "ROYCCAT2"},
        {"bank_id": "TD", "bankname": "TD Bank", "country": canada, "orderindex": 30, "institutionnumber": "004", "swiftcode": "TDOMCATTTOR"},
    ]
    for data in banks_data:
        obj, created = Bank.objects.get_or_create(bank_id=data["bank_id"], defaults=data)
        print(("Created bank: " if created else "Bank exists: ") + obj.bankname)

    # Insurance Carriers
    carriers_data = [
        {"insucarrier_id": "IC1", "orderindex": 10, "title": "Alpha Insurance", "active": True},
        {"insucarrier_id": "IC2", "orderindex": 20, "title": "Beta Insurance", "active": True},
        {"insucarrier_id": "IC3", "orderindex": 30, "title": "Gamma Insurance", "active": True},
    ]
    for data in carriers_data:
        obj, created = InsuranceCarrier.objects.get_or_create(insucarrier_id=data["insucarrier_id"], defaults=data)
        print(("Created insurance carrier: " if created else "Carrier exists: ") + obj.title)

    # Professions
    profession_list = [
        {"profession_id": "LAW", "title": "Lawyer"},
        {"profession_id": "ENG", "title": "Engineer"},
        {"profession_id": "ACC", "title": "Accountant"},
    ]
    for data in profession_list:
        obj, created = Profession.objects.get_or_create(profession_id=data["profession_id"], defaults=data)
        print(("Created profession: " if created else "Profession exists: ") + obj.title)

    # Professionals
    toronto = City.objects.get(city_id='TOR')
    professionals_data = [
        {"professional_id": "PRO1", "profession_id": "LAW", "fullname": "Alice Barr", "address": "100 King St", "email": "alice@example.com", "phone": "4160000001", "mobile": "4161000001", "city": toronto, "reliability": "High"},
        {"professional_id": "PRO2", "profession_id": "ENG", "fullname": "Bob Stone", "address": "200 Queen St", "email": "bob@example.com", "phone": "4160000002", "mobile": "4161000002", "city": toronto, "reliability": "Medium"},
        {"professional_id": "PRO3", "profession_id": "ACC", "fullname": "Cathy Price", "address": "300 Bay St", "email": "cathy@example.com", "phone": "4160000003", "mobile": "4161000003", "city": toronto, "reliability": "Low"},
    ]
    for data in professionals_data:
        profession = Profession.objects.get(profession_id=data.pop("profession_id"))
        data["profession"] = profession
        obj, created = Professional.objects.get_or_create(professional_id=data["professional_id"], defaults=data)
        print(("Created professional: " if created else "Professional exists: ") + obj.fullname)

    # Ensure consultant user exists (used for ownership/assignment)
    consultant, _ = Consultant.objects.get_or_create(
        username='testuser',
        defaults=dict(
            consultant_id='TEST001', fullname='Test User', email='test@example.com',
            orderindex=1, role='C', is_staff=True, is_active=True, active=True
        )
    )

    # Clients
    base_client_data = [
        {"client_id": "CL001", "surname": "Smith", "name": "John"},
        {"client_id": "CL002", "surname": "Doe", "name": "Jane"},
        {"client_id": "CL003", "surname": "Brown", "name": "Mike"},
    ]
    for idx, data in enumerate(base_client_data, start=1):
        defaults = dict(
            registrationdate=timezone.now().date(),
            registrationuser='admin',
            onoma=data["name"], eponymo=data["surname"],
            address=f"{100+idx} Front St", postalcode="M5J2N1",
            country=canada, province=ontario, city=toronto,
            phone1=f"41655500{idx}", mobile1=f"41666600{idx}",
            email=f"{data['name'].lower()}.{data['surname'].lower()}@example.com",
            active=True
        )
        obj, created = Client.objects.get_or_create(client_id=data["client_id"], defaults={**data, **defaults})
        print(("Created client: " if created else "Client exists: ") + f"{obj.surname} {obj.name}")

    # Bank Client Accounts
    client1 = Client.objects.get(client_id='CL001')
    bank1 = Bank.objects.get(bank_id='BMO')
    bcas = [
        {"bankclientacco_id": "BCA001", "client": client1, "bank": bank1, "transitnumber": "00011", "accountnumber": "000123456789"},
        {"bankclientacco_id": "BCA002", "client": Client.objects.get(client_id='CL002'), "bank": Bank.objects.get(bank_id='RBC'), "transitnumber": "00022", "accountnumber": "000987654321"},
        {"bankclientacco_id": "BCA003", "client": Client.objects.get(client_id='CL003'), "bank": Bank.objects.get(bank_id='TD'), "transitnumber": "00033", "accountnumber": "000555444333"},
    ]
    for data in bcas:
        obj, created = BankClientAccount.objects.get_or_create(bankclientacco_id=data["bankclientacco_id"], defaults=data)
        print(("Created bank client account: " if created else "Bank client account exists: ") + obj.accountnumber)

    # Project Categories
    categories = [
        {"projcate_id": "A", "orderindex": 1, "title": "Incorporation"},
        {"projcate_id": "B", "orderindex": 2, "title": "Real Estate"},
        {"projcate_id": "C", "orderindex": 3, "title": "Litigation"},
    ]
    for data in categories:
        obj, created = ProjectCategory.objects.get_or_create(projcate_id=data["projcate_id"], defaults=data)
        print(("Created project category: " if created else "Project category exists: ") + obj.title)

    # Projects
    projects_data = [
        {"project_id": "PRJ001", "filecode": "TOR/000001/05-2019", "title": "Incorporate ACME", "deadline": timezone.now().date()},
        {"project_id": "PRJ002", "filecode": "TOR/000002/06-2019", "title": "Buy Condo", "deadline": timezone.now().date()},
        {"project_id": "PRJ003", "filecode": "TOR/000003/07-2019", "title": "Court Case", "deadline": timezone.now().date()},
    ]
    for data in projects_data:
        defaults = dict(
            registrationdate=timezone.now().date(), registrationuser='admin', consultant=consultant,
            taxation=False, details='Sample project', notes='Test data'
        )
        obj, created = Project.objects.get_or_create(project_id=data["project_id"], defaults={**data, **defaults})
        if created:
            # Attach categories (first two for first project, etc.)
            obj.categories.add(ProjectCategory.objects.get(projcate_id='A'))
        print(("Created project: " if created else "Project exists: ") + obj.title)

    # Associated Clients (primary + secondary)
    prj1 = Project.objects.get(project_id='PRJ001')
    assoc_list = [
        {"assoclient_id": "AS001", "project": prj1, "client": client1, "orderindex": 0},
        {"assoclient_id": "AS002", "project": prj1, "client": Client.objects.get(client_id='CL002'), "orderindex": 1},
    ]
    for data in assoc_list:
        obj, created = AssociatedClient.objects.get_or_create(assoclient_id=data["assoclient_id"], defaults=data)
        print(("Created associated client: " if created else "Associated client exists: ") + obj.client.__str__())

    # Documents
    documents = [
        {"document_id": "DOC001", "project": prj1, "created": timezone.now().date(), "title": "Articles of Incorporation", "validuntil": timezone.now().date(), "filepath": "/tmp/doc1.pdf"},
        {"document_id": "DOC002", "project": prj1, "created": timezone.now().date(), "title": "Shareholders Agreement", "validuntil": timezone.now().date(), "filepath": "/tmp/doc2.pdf"},
    ]
    for data in documents:
        obj, created = Document.objects.get_or_create(document_id=data["document_id"], defaults=data)
        print(("Created document: " if created else "Document exists: ") + obj.title)

    # Properties
    properties = [
        {"property_id": "PROP001", "project": Project.objects.get(project_id='PRJ002'), "country": canada, "province": ontario, "city": toronto, "description": "Downtown Condo", "location": "Toronto", "type": "Apartment", "status": "Rented", "market": "LongTerm"},
        {"property_id": "PROP002", "project": Project.objects.get(project_id='PRJ002'), "country": canada, "province": ontario, "city": toronto, "description": "Parking Space", "location": "Toronto", "type": "Other", "status": "Empty", "market": "Wait"},
    ]
    for data in properties:
        obj, created = Property.objects.get_or_create(property_id=data["property_id"], defaults=data)
        print(("Created property: " if created else "Property exists: ") + obj.description)

    # Task Categories
    tcategories = [
        {"taskcate_id": "INFORMAL", "title": "Informal", "orderindex": 0, "active": True},
        {"taskcate_id": "LEGAL", "title": "Legal", "orderindex": 1, "active": True},
        {"taskcate_id": "ADMIN", "title": "Administration", "orderindex": 2, "active": True},
    ]
    for data in tcategories:
        obj, created = TaskCategory.objects.get_or_create(taskcate_id=data["taskcate_id"], defaults=data)
        print(("Created task category: " if created else "Task category exists: ") + obj.title)

    # Project Tasks
    task_list = [
        {"projtask_id": "T001", "project": prj1, "title": "Collect IDs", "taskcate": TaskCategory.objects.get(taskcate_id='ADMIN'), "priority": "B", "assigner": consultant, "assignee": consultant, "assigndate": timezone.now().date()},
        {"projtask_id": "T002", "project": prj1, "title": "Prepare Filing", "taskcate": TaskCategory.objects.get(taskcate_id='LEGAL'), "priority": "A", "assigner": consultant, "assignee": consultant},
        {"projtask_id": "T003", "project": Project.objects.get(project_id='PRJ002'), "title": "Book Inspection", "taskcate": TaskCategory.objects.get(taskcate_id='ADMIN'), "priority": "C", "assigner": consultant, "assignee": consultant},
    ]
    for data in task_list:
        obj, created = ProjectTask.objects.get_or_create(projtask_id=data["projtask_id"], defaults=data)
        print(("Created project task: " if created else "Project task exists: ") + obj.title)

    # Task Comments
    t1 = ProjectTask.objects.get(projtask_id='T001')
    comments = [
        {"taskcomm_id": "TC001", "projtask": t1, "consultant": consultant, "comment": "Client sent documents."},
        {"taskcomm_id": "TC002", "projtask": t1, "consultant": consultant, "comment": "Verified IDs."},
    ]
    for data in comments:
        obj, created = TaskComment.objects.get_or_create(taskcomm_id=data["taskcomm_id"], defaults=data)
        print(("Created task comment: " if created else "Task comment exists: ") + obj.comment[:20])

    # Cash
    cash_entries = [
        {"cash_id": "C001", "project": prj1, "country": canada, "trandate": timezone.now().date(), "consultant": consultant, "kind": "E", "amountexp": 120.50, "reason": "Gov fees"},
        {"cash_id": "C002", "project": prj1, "country": canada, "trandate": timezone.now().date(), "consultant": consultant, "kind": "P", "amountpay": 200.00, "reason": "Client deposit"},
    ]
    for data in cash_entries:
        obj, created = Cash.objects.get_or_create(cash_id=data["cash_id"], defaults=data)
        print(("Created cash entry: " if created else "Cash exists: ") + obj.reason)

    # Taxation Projects
    taxation = [
        {"taxproj_id": "TX001", "client": client1, "consultant": consultant, "taxuse": 2024, "deadline": timezone.now().date()},
        {"taxproj_id": "TX002", "client": Client.objects.get(client_id='CL002'), "consultant": consultant, "taxuse": 2024, "deadline": timezone.now().date()},
    ]
    for data in taxation:
        obj, created = TaxationProject.objects.get_or_create(taxproj_id=data["taxproj_id"], defaults=data)
        print(("Created taxation project: " if created else "Taxation project exists: ") + obj.client.__str__())

    # Bank Project Accounts
    bpa_list = [
        {"bankprojacco_id": "BPA001", "project": prj1, "client": client1, "bankclientacco": BankClientAccount.objects.get(bankclientacco_id='BCA001')},
    ]
    for data in bpa_list:
        obj, created = BankProjectAccount.objects.get_or_create(bankprojacco_id=data["bankprojacco_id"], defaults=data)
        print(("Created bank project account: " if created else "Bank project account exists: ") + obj.bankclientacco.accountnumber)

if __name__ == "__main__":
    add_test_data()
