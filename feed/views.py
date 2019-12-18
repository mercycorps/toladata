from tola_management.permissions import verify_program_access_level
from feed.serializers import ProgramTargetFrequenciesSerializer
from workflow.models import Program
from indicators.models import Indicator
from django.db import models
from django.shortcuts import get_object_or_404
from rest_framework import response, viewsets


class ProgramTargetFrequencies(viewsets.ViewSet):
    def list(self, request):
        program = get_object_or_404(Program, pk=request.query_params.get('program_id', None))
        verify_program_access_level(request, program.pk, 'low')
        queryset = program.indicator_set.exclude(
            models.Q(target_frequency=Indicator.EVENT) | models.Q(target_frequency__isnull=True)
            ).values('target_frequency').distinct().order_by('target_frequency')
        serializer = ProgramTargetFrequenciesSerializer(queryset, many=True)
        return response.Response(serializer.data)