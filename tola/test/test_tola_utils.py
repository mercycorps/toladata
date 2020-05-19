from decimal import Decimal
from django.test import TestCase

from ..util import usefully_normalize_decimal as unorm


class TestUsefullyNormalizeDecimal (TestCase):

    def test_usefully_normalize_decimal(self):
        self.assertEqual(str(unorm(Decimal("3"))), "3", )
        self.assertEqual(str(unorm(Decimal("3000"))), "3000")
        normalized_number = unorm(Decimal("30.00001"))
        self.assertEqual(str(normalized_number), "30.00001")
        self.assertEqual(type(normalized_number), Decimal)
        self.assertEqual(str(unorm(Decimal("30.0000"))), "30")
        self.assertEqual(str(unorm(3000.0)), "3000")
        normalized_number = unorm(30.0000)
        self.assertEqual(str(normalized_number), "30")
        self.assertEqual(type(normalized_number), Decimal)
        self.assertEqual(str(unorm("3000")), "3000")
        self.assertEqual(str(unorm("30.0000")), "30")
        self.assertEqual(str(unorm(0)), "0")
        normalized_number = unorm(0.0000)
        self.assertEqual(str(normalized_number), "0")
        self.assertEqual(type(normalized_number), Decimal)
        self.assertEqual(unorm("silly rabbit"), "silly rabbit")
        self.assertEqual(unorm(""), "")
        self.assertIsNone(unorm(None))
