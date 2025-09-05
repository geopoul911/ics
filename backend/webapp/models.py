from django.db.models.base import Model
from django.utils import timezone
# from django.contrib import admin
from django.db.models import PROTECT, CASCADE, SET_NULL
from django.db.models.fields import (
    TextField,
    CharField,
    # IntegerField,
    DateField,
    # BooleanField,
    # FloatField,
    DateTimeField,
    # EmailField,
)
# from tinymce.models import HTMLField
from django.db.models.fields.related import (
    # ManyToManyField,
    ForeignKey
)
from django.core.validators import FileExtensionValidator
# from django.core.validators import MaxValueValidator, MinValueValidator
import django.db.models as models
from django.db.models.fields.files import ImageField

from django.core.files.base import ContentFile
from decimal import Decimal
import os.path
from django.conf import settings
from django.core.exceptions import ValidationError
from django.utils import timezone
import re
from django.contrib.auth import get_user_model
from accounts.models import Consultant


User = get_user_model()


# Used for custom object based permission system
ACTION_NAMES = (
    ('VIE', 'View'),
    ('CRE', 'Create'),
    ('UPD', 'Update'),
    ('DEL', 'Delete'),
)


class Photo(models.Model):
    date_created = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=255, blank=True, null=True)
    photo = models.ImageField(max_length=255, blank=True, null=True)
    photo_comment = models.CharField(max_length=700, default='')
    order = models.IntegerField(default=0)  # Field to track photo ordering

    class Meta:
        ordering = ['order']  # Default ordering by the order field

    def save_from_filename(self, *args, **kwargs):
        filename = args[0]
        self.photo = filename
        self.photo.save(filename, ContentFile(open(filename, 'rb').read()), save=False)
        self.title = args[1]
        super(Photo, self).save()

    def __str__(self):
        return str(self.title)

    def delete(self):
        path = os.path.join(settings.BASE_DIR, 'static', self.photo.name)
        if os.path.isfile(path):
            os.remove(path)
        super(Photo, self).delete()


class Note(models.Model):
    date = models.DateField(null=True, blank=True, default=timezone.now)
    text = models.TextField(max_length=255, blank=True, null=True)
    user = models.ForeignKey(User, blank=True, null=True, on_delete=PROTECT)

    def get_human_date(self):
        return self.date.strftime("%d %b %Y")

    class Meta:
        verbose_name = "Note"
        verbose_name_plural = "Notes"

    def __str__(self):
        return str(self.text[:10])


# # Logging system, every action made in group plan is stored here
# class History(models.Model):
#     user = models.ForeignKey(User, blank=True, null=True, on_delete=PROTECT)
#     model_name = models.CharField(max_length=3, choices=MODEL_NAMES_LOGGING, null=False, blank=False)
#     action = models.CharField(max_length=3, choices=ACTION_NAMES, null=False, blank=False)
#     description = models.CharField(max_length=40000, null=False, blank=False)
#     timestamp = models.DateTimeField(auto_now_add=True)
#     ip_address = models.CharField(max_length=255, null=True, blank=True)

#     def __str__(self):
#         return str(self.description)


# Create your models here.
class Country(models.Model):
    country_id = models.CharField(max_length=3, primary_key=True)
    orderindex = models.SmallIntegerField(default=0)
    currency = models.CharField(max_length=10)
    title = models.CharField(max_length=40, unique=True)

    def __str__(self):
        return self.title

class Province(models.Model):
    province_id = models.CharField(max_length=10, primary_key=True)
    orderindex = models.SmallIntegerField(default=0)
    country = models.ForeignKey(Country, on_delete=models.PROTECT)
    title = models.CharField(max_length=40, unique=True)

    def __str__(self):
        return self.title

class City(models.Model):
    city_id = models.CharField(max_length=10, primary_key=True)
    orderindex = models.SmallIntegerField(default=0)
    country = models.ForeignKey(Country, on_delete=models.PROTECT)
    province = models.ForeignKey(Province, on_delete=models.PROTECT)
    title = models.CharField(max_length=40, unique=True)

    def __str__(self):
        return self.title

class InsuranceCarrier(models.Model):
    insucarrier_id = models.CharField(max_length=10, primary_key=True)
    orderindex = models.SmallIntegerField(default=0)
    title = models.CharField(max_length=40, unique=True)
    active = models.BooleanField(default=True)

    def __str__(self):
        return self.title

class Bank(models.Model):
    bank_id = models.CharField(max_length=10, primary_key=True)
    country = models.ForeignKey(Country, on_delete=models.PROTECT)
    orderindex = models.SmallIntegerField(default=0)
    bankname = models.CharField(max_length=40, unique=True)
    institutionnumber = models.CharField(max_length=3)
    swiftcode = models.CharField(max_length=11)
    active = models.BooleanField(default=True)

    def __str__(self):
        return self.bankname

class Client(models.Model):
    client_id = models.CharField(max_length=10, primary_key=True)
    registrationdate = models.DateField(auto_now_add=True)
    registrationuser = models.CharField(max_length=10)  # Χρήστης που δημιούργησε την καρτέλα του πελάτη
    name = models.CharField(max_length=40)
    surname = models.CharField(max_length=40)
    onoma = models.CharField(max_length=40)
    eponymo = models.CharField(max_length=40)

    address = models.CharField(max_length=120)
    postalcode = models.CharField(max_length=10)

    country = models.ForeignKey(Country, on_delete=models.PROTECT, related_name='clients_country')
    province = models.ForeignKey(Province, on_delete=models.PROTECT, related_name='clients_province')
    city = models.ForeignKey(City, on_delete=models.PROTECT, related_name='clients_city')

    phone1 = models.CharField(max_length=15, blank=True, null=True)
    phone2 = models.CharField(max_length=15, blank=True, null=True)
    mobile1 = models.CharField(max_length=15, blank=True, null=True)
    mobile2 = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)

    birthdate = models.DateField()
    birthplace = models.CharField(max_length=60)
    fathername = models.CharField(max_length=80)
    mothername = models.CharField(max_length=80)

    maritalstatus = models.CharField(max_length=20, blank=True, null=True, choices=[
        ('Single', 'Single'),
        ('Married', 'Married'),
        ('Common law', 'Common law'),
        ('Divorced', 'Divorced'),
        ('Widowed', 'Widowed'),
    ])


    deceased = models.BooleanField(default=False)
    deceasedate = models.DateField(blank=True, null=True)

    afm = models.CharField(max_length=10, blank=True, null=True)
    sin = models.CharField(max_length=10)
    amka = models.CharField(max_length=11, blank=True, null=True)

    passportcountry = models.ForeignKey(Country, on_delete=models.PROTECT, related_name='clients_passportcountry')
    passportnumber = models.CharField(max_length=15)
    passportexpiredate = models.DateField()

    policeid = models.CharField(max_length=15, blank=True, null=True)
    profession = models.CharField(max_length=40, blank=True, null=True)

    taxmanagement = models.BooleanField(default=False)
    taxrepresentation = models.BooleanField(default=False)
    taxrepresentative = models.CharField(max_length=200, blank=True, null=True)

    retired = models.BooleanField(default=False)
    pensioncountry1 = models.ForeignKey(Country, on_delete=models.PROTECT, blank=True, null=True, related_name='clients_pensioncountry1')
    insucarrier1 = models.ForeignKey(InsuranceCarrier, on_delete=models.PROTECT, blank=True, null=True, related_name='clients_insucarrier1')
    pensioninfo1 = models.CharField(max_length=80, blank=True, null=True)
    pensioncountry2 = models.ForeignKey(Country, on_delete=models.PROTECT, blank=True, null=True, related_name='clients_pensioncountry2')
    insucarrier2 = models.ForeignKey(InsuranceCarrier, on_delete=models.PROTECT, blank=True, null=True, related_name='clients_insucarrier2')
    pensioninfo2 = models.CharField(max_length=80, blank=True, null=True)

    active = models.BooleanField(default=True)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.surname} {self.name}"  # or eponymo/onoma for Greek

class BankClientAccount(models.Model):
    bankclientacco_id = models.CharField(max_length=10, primary_key=True)
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    bank = models.ForeignKey(Bank, on_delete=models.PROTECT)
    transitnumber = models.CharField(max_length=5)
    accountnumber = models.CharField(max_length=20)
    iban = models.CharField(max_length=34, blank=True, null=True)
    active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.bank.bankname} - {self.accountnumber}"


"""
1)	Administrator: (τεχνικός) πλήρης πρόσβαση, με πρόσβαση σε εργασίες συντήρησης της Βάσης Δεδομένων (DB).
2)	Supervisor: (ανώτατο επίπεδο διοίκησης) πλήρης πρόσβαση, χωρίς πρόσβαση στην DB. Ορίζει υπεύθυνους (consultants in charge) και διεκπεραιωτές (consultants). Δικαιώματα για νέα εγγραφή, ανάγνωση, ενημέρωση και διαγραφή (create, read, update and delete – CRUD)
3)	Superuser: (υπεύθυνοι-consultants in charge) πλήρης πρόσβαση, χωρίς πρόσβαση στην DB. Ορίζει διεκπεραιωτές (consultants). Δικαιώματα για νέα εγγραφή, ανάγνωση, ενημέρωση και διαγραφή (create, read, update and delete – CRUD)
4)	User: (διεκπεραιωτές-consultants) περιορισμένη πρόσβαση. Δικαιώματα για νέα εγγραφή και ανάγνωση, όχι όμως ενημέρωση και διαγραφή (create, read - CR)
"""



class ProjectCategory(models.Model):
    projcate_id = models.CharField(max_length=1, primary_key=True)
    orderindex = models.SmallIntegerField(default=0)
    active = models.BooleanField(default=True)
    title = models.CharField(max_length=40, unique=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['orderindex', 'title']

class Project(models.Model):
    STATUS_CHOICES = [
        ('Created', 'Created'),
        ('Assigned', 'Assigned'),
        ('Inprogress', 'In Progress'),
        ('Completed', 'Completed'),
        ('Settled', 'Settled'),
        ('Abandoned', 'Abandoned'),
    ]

    project_id = models.CharField(max_length=10, primary_key=True)
    registrationdate = models.DateField(auto_now_add=True)
    registrationuser = models.CharField(max_length=15)

    consultant = models.ForeignKey(Consultant, on_delete=models.PROTECT)

    filecode = models.CharField(max_length=20, help_text="Format: 3 chars for office city/UniqueNumber(6)/Month(2)-Year(4) e.g., TOR/000256/05-2019")
    taxation = models.BooleanField(default=False, blank=True, null=True)
    deadline = models.DateField(blank=True, null=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Created')

    assigned = models.BooleanField(default=False)
    assignedate = models.DateField(blank=True, null=True)

    inprogress = models.BooleanField(default=False)
    inprogressdate = models.DateField(blank=True, null=True)

    completed = models.BooleanField(default=False)
    completiondate = models.DateField(blank=True, null=True)

    settled = models.BooleanField(default=False)
    settlementdate = models.DateField(blank=True, null=True)

    abandoned = models.BooleanField(default=False)
    abandondate = models.DateField(blank=True, null=True)

    title = models.CharField(max_length=120)
    categories = models.ManyToManyField(ProjectCategory, related_name='projects')
    details = models.TextField()
    notes = models.TextField(blank=True, null=True)

    def clean(self):
        # Validate filecode format
        if self.filecode:
            pattern = r'^[A-Z]{3}/\d{6}/\d{2}-\d{4}$'
            if not re.match(pattern, self.filecode):
                raise ValidationError({
                    'filecode': 'Invalid format. Must be: 3 uppercase letters/6 digits/2 digits-4 digits (e.g., TOR/000256/05-2019)'
                })

        # Update status based on boolean fields
        if self.assigned and not self.assignedate:
            self.assignedate = timezone.now().date()
            self.status = 'Assigned'
        if self.inprogress and not self.inprogressdate:
            self.inprogressdate = timezone.now().date()
            self.status = 'Inprogress'
        if self.completed and not self.completiondate:
            self.completiondate = timezone.now().date()
            self.status = 'Completed'
        if self.settled and not self.settlementdate:
            self.settlementdate = timezone.now().date()
            self.status = 'Settled'
        if self.abandoned and not self.abandondate:
            self.abandondate = timezone.now().date()
            self.status = 'Abandoned'

        # Validate taxation/category constraints
        if self.taxation and self.categories.exists():
            raise ValidationError({
                'taxation': 'Taxation projects cannot have categories'
            })

        # On create (_state.adding True), M2M categories are not yet set; skip required-category check
        if not self._state.adding:
            # On update, require at least one category when not taxation
            if not self.taxation and not self.categories.exists():
                raise ValidationError({'categories': 'At least one category is required.'})

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Project"
        verbose_name_plural = "Projects"
        ordering = ['-registrationdate']

class AssociatedClient(models.Model):
    assoclient_id = models.CharField(max_length=10, primary_key=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='associated_clients')
    client = models.ForeignKey(Client, on_delete=models.PROTECT, related_name='associated_projects')
    orderindex = models.SmallIntegerField(default=0)
    notes = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = "Associated Client"
        verbose_name_plural = "Associated Clients"
        ordering = ['orderindex', 'client__surname', 'client__name']
        unique_together = ('project', 'client')
        constraints = [
            models.UniqueConstraint(
                fields=['project', 'client'],
                name='unique_project_client'
            )
        ]

    def clean(self):
        from django.core.exceptions import ValidationError

        # Ensure at least one client per project
        if not self.project.associated_clients.exists():
            # If first association and orderindex not provided, set to 0 automatically
            if self.orderindex in (None, ""):
                self.orderindex = 0
            elif self.orderindex != 0:
                raise ValidationError({'orderindex': 'First client must have orderindex 0'})

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.project.title} - {self.client}"

    @classmethod
    def get_primary_client(cls, project):
        """Returns the primary client (orderindex=0) for a project"""
        return cls.objects.filter(project=project, orderindex=0).first()

    @classmethod
    def get_secondary_clients(cls, project):
        """Returns all secondary clients (orderindex>0) for a project"""
        return cls.objects.filter(project=project, orderindex__gt=0).order_by('orderindex')

def document_upload_to(instance, filename):
    project_part = getattr(getattr(instance, 'project', None), 'project_id', None) or 'unassigned'
    return os.path.join('documents', project_part, timezone.now().strftime('%Y/%m/%d'), filename)


class Document(models.Model):
    STATUS_CHOICES = [
        ('SENT_TO_ATHENS', 'Sent To Athens'),
        ('RECEIVED_IN_ATHENS', 'Received In Athens'),
        ('SENT_TO_TORONTO', 'Sent To Toronto'),
        ('RECEIVED_IN_TORONTO', 'Received In Toronto'),
        ('SENT_TO_MONTREAL', 'Sent To Montreal'),
        ('RECEIVED_IN_MONTREAL', 'Received In Montreal'),
        ('SENT_TO_CLIENT', 'Sent To Client'),
        ('RECEIVED_FROM_CLIENT', 'Received From Client'),
    ]

    document_id = models.CharField(max_length=10, primary_key=True)
    project = models.ForeignKey(Project, on_delete=models.SET_NULL, blank=True, null=True, related_name='documents')
    client = models.ForeignKey(Client, on_delete=models.SET_NULL, blank=True, null=True, related_name='documents')
    created = models.DateField(auto_now_add=True)
    title = models.CharField(max_length=40)
    validuntil = models.DateField(blank=True, null=True)

    filepath = models.FileField(
        upload_to=document_upload_to,
        max_length=255,
        blank=True,                                # set to False if you want it required
        null=True,
        validators=[FileExtensionValidator([
            'pdf', 'jpg', 'jpeg', 'png', 'tif', 'tiff', 'txt', 'doc', 'docx', 'xls', 'xlsx',
            'ppt', 'pptx'
        ])],
    )


    original = models.BooleanField(default=False)
    trafficable = models.BooleanField(default=False)
    status = models.CharField(max_length=40, blank=True, null=True, choices=STATUS_CHOICES)
    statusdate = models.DateField(auto_now=True,blank=True, null=True)
    logstatus = models.TextField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = "Document"
        verbose_name_plural = "Documents"
        ordering = ['-created']
        constraints = [
            models.CheckConstraint(
                check=~models.Q(project__isnull=True, client__isnull=True),
                name='document_must_have_project_or_client'
            )
        ]

    def clean(self):
        from django.core.exceptions import ValidationError

        # Validate that at least one of project or client is set
        if not self.project and not self.client:
            raise ValidationError('Document must be associated with either a project or a client')

        # Validate status changes
        if self.status and not self.statusdate:
            self.statusdate = timezone.now().date()

        # Update log when status changes
        if self.status and self.statusdate:
            log_entry = f"{self.statusdate}: {self.status}\n"
            if self.logstatus:
                self.logstatus = log_entry + self.logstatus
            else:
                self.logstatus = log_entry

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    def delete(self, *args, **kwargs):
        """Delete the Document and remove the stored file (if present)."""
        file_name = None
        file_storage = None
        try:
            if self.filepath:
                file_name = self.filepath.name
                file_storage = self.filepath.storage
        except Exception:
            file_name = None
            file_storage = None

        super().delete(*args, **kwargs)

        try:
            if file_storage and file_name and file_storage.exists(file_name):
                file_storage.delete(file_name)
        except Exception:
            # Swallow storage errors to avoid breaking delete flow
            pass

    def update_status(self, new_status, date=None):
        """Updates document status and logs the change"""
        if new_status not in dict(self.STATUS_CHOICES):
            raise ValidationError('Invalid status')
        
        self.status = new_status
        self.statusdate = date or timezone.now().date()
        self.save()

    @property
    def is_expired(self):
        """Checks if document is expired"""
        if not self.validuntil:
            return False
        return self.validuntil < timezone.now().date()

    @property
    def current_location(self):
        """Returns the current location of the document based on status"""
        if not self.status:
            return "Unknown"
        return dict(self.STATUS_CHOICES).get(self.status, "Unknown")

class Profession(models.Model):
    profession_id = models.CharField(max_length=10, primary_key=True)
    title = models.CharField(max_length=40, unique=True)

    def __str__(self):
        return self.title

class Professional(models.Model):
    professional_id = models.CharField(max_length=10, primary_key=True)
    profession = models.ForeignKey(Profession, on_delete=models.PROTECT)
    fullname = models.CharField(max_length=40)
    address = models.CharField(max_length=80, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    mobile = models.CharField(max_length=15)
    city = models.ForeignKey(City, on_delete=models.PROTECT)
    reliability = models.CharField(max_length=10, blank=True, null=True, choices=[
        ('High', 'High'),
        ('Medium', 'Medium'),
        ('Low', 'Low'),
    ])
    active = models.BooleanField(default=True)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.fullname

class ClientContact(models.Model):
    RELIABILITY_CHOICES = [
        ('High', 'High'),
        ('Medium', 'Medium'),
        ('Low', 'Low'),
    ]

    clientcont_id = models.CharField(max_length=10, primary_key=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='contacts')
    professional = models.ForeignKey(Professional, on_delete=models.PROTECT, blank=True, null=True, 
        related_name='project_contacts')
    fullname = models.CharField(max_length=40)
    fathername = models.CharField(max_length=80, blank=True, null=True)
    mothername = models.CharField(max_length=80, blank=True, null=True)
    connection = models.CharField(max_length=40, blank=True, null=True)
    address = models.CharField(max_length=80, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    mobile = models.CharField(max_length=15)
    profession = models.CharField(max_length=40, blank=True, null=True)
    reliability = models.CharField(max_length=10, choices=RELIABILITY_CHOICES, blank=True, null=True)
    city = models.CharField(max_length=40)
    active = models.BooleanField(default=True)
    notes = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = "Client Contact"
        verbose_name_plural = "Client Contacts"
        ordering = ['fullname']

    def clean(self):
        from django.core.exceptions import ValidationError

        # If professional is selected, copy their information
        if self.professional:
            self.fullname = self.professional.fullname
            self.address = self.professional.address
            self.email = self.professional.email
            self.phone = self.professional.phone
            self.mobile = self.professional.mobile
            self.profession = self.professional.profession.title
            self.reliability = self.professional.reliability
            self.city = self.professional.city.title

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.fullname} - {self.connection or 'Contact'}"

    @property
    def is_professional(self):
        """Returns True if this contact is a professional"""
        return bool(self.professional)

    @property
    def contact_type(self):
        """Returns the type of contact (Professional or Manual)"""
        return "Professional" if self.is_professional else "Manual Contact"

    def get_contact_info(self):
        """Returns a dictionary with all contact information"""
        return {
            'fullname': self.fullname,
            'address': self.address,
            'email': self.email,
            'phone': self.phone,
            'mobile': self.mobile,
            'profession': self.profession,
            'reliability': self.reliability,
            'city': self.city,
            'is_professional': self.is_professional,
            'professional_id': self.professional.professional_id if self.professional else None
        }

class Property(models.Model):
    property_id = models.CharField(max_length=10, primary_key=True)
    project = models.ForeignKey(Project, on_delete=models.PROTECT)
    country = models.ForeignKey(Country, on_delete=models.PROTECT)
    province = models.ForeignKey(Province, on_delete=models.PROTECT)
    city = models.ForeignKey(City, on_delete=models.PROTECT)
    description = models.CharField(max_length=80)
    location = models.CharField(max_length=80, blank=True, null=True)
    type = models.CharField(max_length=40, choices=[
        ('Plot', 'Plot'),
        ('Land', 'Land'),
        ('House', 'House'),
        ('Apartment', 'Apartment'),
        ('Store', 'Store'),
        ('Other', 'Other'),
    ])
    constructyear = models.CharField(max_length=4, blank=True, null=True)
    status = models.CharField(max_length=40, blank=True, null=True, choices=[
        ('Empty', 'Empty'),
        ('Rented', 'Rented'),
        ('Unfinished', 'Unfinished'),
    ])
    market = models.CharField(max_length=40, blank=True, null=True, choices=[
        ('ShortTerm', 'ShortTerm'),
        ('LongTerm', 'LongTerm'),
        ('Sale', 'Sale'),
        ('Wait', 'Wait'),
        ('Own', 'Own'),
    ])
    broker = models.CharField(max_length=120, blank=True, null=True)
    active = models.BooleanField(default=True)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.description

class BankProjectAccount(models.Model):
    bankprojacco_id = models.CharField(max_length=10, primary_key=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    bankclientacco = models.ForeignKey(BankClientAccount, on_delete=models.SET_NULL, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.project.title} - {self.bankclientacco}"

class TaskCategory(models.Model):
    taskcate_id = models.CharField(max_length=10, primary_key=True)
    title = models.CharField(max_length=40, unique=True)
    orderindex = models.SmallIntegerField(default=0)
    active = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Task Category"
        verbose_name_plural = "Task Categories"
        ordering = ['orderindex', 'title']

    def __str__(self):
        return self.title

    @classmethod
    def get_informal_category(cls):
        """Returns or creates the informal category"""
        informal, created = cls.objects.get_or_create(
            taskcate_id='INFORMAL',
            defaults={
                'title': 'Άτυπη',
                'orderindex': 0,
                'active': True
            }
        )
        return informal

    def save(self, *args, **kwargs):
        # Ensure informal category is always active
        if self.taskcate_id == 'INFORMAL':
            self.active = True
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        # Prevent deletion of informal category
        if self.taskcate_id == 'INFORMAL':
            raise ValidationError("Cannot delete the informal category")
        super().delete(*args, **kwargs)

    @classmethod
    def get_active_categories(cls):
        """Returns all active categories ordered by orderindex"""
        return cls.objects.filter(active=True).order_by('orderindex')

    @classmethod
    def get_category_groups(cls):
        """Returns categories grouped by their orderindex"""
        return cls.objects.filter(active=True).order_by('orderindex').values_list('title', flat=True)

class ProjectTask(models.Model):
    STATUS_CHOICES = [
        ('Created', 'Created'),
        ('Assigned', 'Assigned'),
        ('Inprogress', 'In Progress'),
        ('Completed', 'Completed'),
    ]

    PRIORITY_CHOICES = [
        ('A', 'High'),
        ('B', 'Medium'),
        ('C', 'Low'),
    ]

    projtask_id = models.CharField(max_length=10, primary_key=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='tasks')
    title = models.CharField(max_length=120)
    details = models.TextField()
    taskcate = models.ForeignKey(TaskCategory, on_delete=models.PROTECT, related_name='tasks')
    priority = models.CharField(max_length=1, choices=PRIORITY_CHOICES, default='B', blank=True, null=True)
    weight = models.PositiveSmallIntegerField(default=1, blank=True, null=True,
        help_text="Task weight for project completion percentage calculation")
    assigner = models.ForeignKey(Consultant, on_delete=models.PROTECT, related_name='assigned_tasks')
    assignee = models.ForeignKey(Consultant, on_delete=models.PROTECT, blank=True, null=True, related_name='tasks')
    assigndate = models.DateField(blank=True, null=True)
    deadline = models.DateField(blank=True, null=True)
    completiondate = models.DateField(blank=True, null=True)
    efforttime = models.DecimalField(max_digits=5, decimal_places=1, blank=True, null=True,
        help_text="Time spent on task in hours (0.5 step)")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Created')
    active = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Project Task"
        verbose_name_plural = "Project Tasks"
        ordering = ['-assigndate', 'priority', 'deadline']

    def clean(self):
        from django.core.exceptions import ValidationError

        # Validate effort time step
        if self.efforttime is not None and (self.efforttime % Decimal('0.5')) != 0:
            raise ValidationError({
                'efforttime': 'Effort time must be in 0.5 hour steps'
            })

        # Auto-assign assign date on create
        if getattr(self._state, 'adding', False) and not self.assigndate:
            self.assigndate = timezone.now().date()

        # Update status based on dates
        if self.completiondate and not self.status == 'Completed':
            self.status = 'Completed'
        elif self.assigndate and not self.status in ['Assigned', 'Inprogress', 'Completed']:
            self.status = 'Assigned'

        # Sync completion date with status
        if self.status == 'Completed' and not self.completiondate:
            self.completiondate = timezone.now().date()
        elif self.status != 'Completed' and self.completiondate:
            self.completiondate = None

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} - {self.get_status_display()}"

    @property
    def is_overdue(self):
        """Checks if task is overdue"""
        if self.deadline and self.status != 'Completed':
            return self.deadline < timezone.now().date()
        return False

    @property
    def completion_percentage(self):
        """Calculates task completion percentage based on status"""
        if self.status == 'Completed':
            return 100
        elif self.status == 'Inprogress':
            return 50
        elif self.status == 'Assigned':
            return 25
        return 0

    @classmethod
    def get_project_completion(cls, project):
        """Calculates project completion percentage based on task weights"""
        tasks = cls.objects.filter(project=project, active=True)
        if not tasks:
            return 0

        total_weight = sum(task.weight for task in tasks)
        completed_weight = sum(
            task.weight for task in tasks 
            if task.status == 'Completed'
        )
        
        return (completed_weight / total_weight) * 100 if total_weight > 0 else 0

    def update_status(self, new_status, completion_date=None):
        """Updates task status and related dates"""
        if new_status not in dict(self.STATUS_CHOICES):
            raise ValidationError('Invalid status')
        
        self.status = new_status
        if new_status == 'Completed':
            self.completiondate = completion_date or timezone.now().date()
        elif new_status == 'Assigned' and not self.assigndate:
            self.assigndate = timezone.now().date()
        
        self.save()

class TaskComment(models.Model):
    taskcomm_id = models.CharField(max_length=10, primary_key=True)
    projtask = models.ForeignKey(ProjectTask, on_delete=models.CASCADE, related_name='comments')
    commentregistration = models.DateTimeField(default=timezone.now)
    consultant = models.ForeignKey(Consultant, on_delete=models.PROTECT, related_name='task_comments')
    comment = models.TextField()

    class Meta:
        verbose_name = "Task Comment"
        verbose_name_plural = "Task Comments"
        ordering = ['-commentregistration']
        indexes = [
            models.Index(fields=['-commentregistration']),
        ]

    def __str__(self):
        return f"Comment by {self.consultant} on {self.commentregistration}"

    def save(self, *args, **kwargs):
        # Ensure commentregistration is set
        if not self.commentregistration:
            self.commentregistration = timezone.now()
        super().save(*args, **kwargs)

    @classmethod
    def create_comment(cls, projtask, consultant, comment):
        """Creates a new comment with automatic field population"""
        return cls.objects.create(
            projtask=projtask,
            consultant=consultant,
            comment=comment
        )

    @property
    def formatted_registration(self):
        """Returns formatted registration date and time"""
        return self.commentregistration.strftime('%Y-%m-%d %H:%M:%S')

    @classmethod
    def get_task_comments(cls, projtask):
        """Returns all comments for a task ordered by registration date"""
        return cls.objects.filter(projtask=projtask).order_by('-commentregistration')

    @classmethod
    def get_consultant_comments(cls, consultant):
        """Returns all comments by a consultant"""
        return cls.objects.filter(consultant=consultant).order_by('-commentregistration')

class Cash(models.Model):
    cash_id = models.CharField(max_length=10, primary_key=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    country = models.ForeignKey(Country, on_delete=models.PROTECT)
    trandate = models.DateField()
    consultant = models.ForeignKey(Consultant, on_delete=models.PROTECT)
    kind = models.CharField(max_length=1, choices=[('E', 'Expense'), ('P', 'Payment')], blank=True, null=True)
    amountexp = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    amountpay = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    reason = models.CharField(max_length=120)

    def __str__(self):
        return f"{self.project.title} - {self.trandate}"

class TaxationProject(models.Model):
    taxproj_id = models.CharField(max_length=10, primary_key=True)
    client = models.ForeignKey(Client, on_delete=models.PROTECT)
    consultant = models.ForeignKey(Consultant, on_delete=models.PROTECT)
    taxuse = models.SmallIntegerField()
    deadline = models.DateField(blank=True, null=True)
    declaredone = models.BooleanField(default=False)
    declarationdate = models.DateField(blank=True, null=True)
    comment = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.client} - {self.taxuse}"

class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ('task_assigned', 'Task Assigned'),
        ('task_updated', 'Task Updated'),
        ('task_completed', 'Task Completed'),
        ('task_deleted', 'Task Deleted'),
        ('deadline_approaching', 'Deadline Approaching'),
    ]

    user = models.ForeignKey(User, on_delete=models.PROTECT, related_name='notifications')
    type = models.CharField(max_length=50, choices=NOTIFICATION_TYPES)
    message = models.TextField()
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    related_task = models.ForeignKey('ProjectTask', on_delete=models.SET_NULL, null=True, blank=True)
    related_project = models.ForeignKey('Project', on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.type} - {self.message[:50]}"
