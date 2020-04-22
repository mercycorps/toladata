from django import test
from factories.workflow_models import (
    RFProgramFactory,
)
from factories.indicators_models import (
    RFIndicatorFactory,
)
from tola.test.utils import SPECIAL_CHARS, lang_context
from workflow.serializers_new import IPTTProgramSerializer


def get_serialized_data(program_pk):
    return IPTTProgramSerializer.load_for_pk(program_pk).data

def get_program_data(**kwargs):
    program = RFProgramFactory(**kwargs)
    return get_serialized_data(program.pk)


class TestIPTTProgramSerializerFilterData(test.TestCase):
    def test_program_no_levels(self):
        data = get_program_data()
        self.assertEqual(data['levels'], [])

    def test_program_one_level(self):
        data = get_program_data(tiers=['Tier1'], levels=1, levels__0={'name': 'Test name'})
        self.assertEqual(data['levels'][0]['tier_name'], 'Tier1')