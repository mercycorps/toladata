from django.apps import AppConfig

class TolaConfig(AppConfig):
    name = 'tola'

    def ready(self):
        # imports needed for the app:
        import tola.signals