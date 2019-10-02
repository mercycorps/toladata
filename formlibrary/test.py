import unittest
from django.test import TestCase
from django.utils import timezone
from workflow.models import Program, Country, ProjectAgreement, Sector, ProjectType, SiteProfile, Office
from formlibrary.models import TrainingAttendance, Distribution, Beneficiary
from datetime import datetime


class TrainingAttendanceTestCase(TestCase):

    def setUp(self):
        new_program = Program.objects.create(name="testprogram")
        new_program.save()
        get_program = Program.objects.get(name="testprogram")
        new_training = TrainingAttendance.objects.create(training_name="testtraining", program=get_program,
                                                           implementer = "34",
                                                           reporting_period = "34",
                                                           total_participants = "34",
                                                           location = "34",
                                                           community = "34",
                                                           training_duration = "34",
                                                           start_date = "34",
                                                           end_date = "34",
                                                           trainer_name = "34",
                                                           trainer_contact_num = "34",
                                                           form_filled_by = "34",
                                                           form_filled_by_contact_num = "34",
                                                           total_male = "34",
                                                           total_female = "34",
                                                           total_age_0_14_male = "34",
                                                           total_age_0_14_female = "34",
                                                           total_age_15_24_male = "34",
                                                           total_age_15_24_female = "34",
                                                           total_age_25_59_male = "34"
                                                         )
        new_training.save()

    def test_training_exists(self):
        """Check for Training object"""
        get_training = TrainingAttendance.objects.get(training_name="testtraining")
        self.assertEqual(TrainingAttendance.objects.filter(id=get_training.id).count(), 1)

class BeneficiaryTestCase(TestCase):

    def setUp(self):
        new_program = Program.objects.create(name="testprogram")
        new_program.save()
        get_program = Program.objects.get(name="testprogram")
        new_training = TrainingAttendance.objects.create(training_name="testtraining", program=get_program)
        new_training.save()
        get_training = TrainingAttendance.objects.get(training_name="testtraining")
        new_benny = Beneficiary.objects.create(beneficiary_name="Joe Test", father_name="Mr Test", age="42", gender="male", signature=False,remarks="life")
        new_benny.training.add(new_training)
        new_benny.save()

    def test_beneficiary_exists(self):
        """Check for Benny object"""
        get_benny = Beneficiary.objects.get(beneficiary_name="Joe Test")
        self.assertEqual(Beneficiary.objects.filter(id=get_benny.id).count(), 1)
