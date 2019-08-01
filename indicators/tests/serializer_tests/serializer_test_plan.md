Views using serializer:
 - current
    - Program Page
       - JSON (js_context)
    - LogFrame
       - JSON (js_context)
       - Excel export
    - IPTT Quickstart
        - JSON (js_context)
    - IPTT
       - JSON (js_context)
       - Excel export
    - RF Builder
        - JSON (js_context)
 - potential
    - Results View
        - Template
    - JSON API (program page output)
    - CSV Export IPTT
    - Indicator Plan

PROGRAM serializer:

Program Page:
 - id (int)
 - results_framework (boolean)
 - does_it_need_additional_target_periods (boolean)
 - resultChainFilterLabel (string - translated)
 - reporting_period_start (ISO date string - for JS Date)
 - reporting_period_end (ISO date string - for JS Date)

