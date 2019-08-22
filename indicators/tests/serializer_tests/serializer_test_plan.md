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

Program Page Program:
 - pk (int)
 - name (str)
 - results_framework (boolean)
 - by_result_chain (string - translated)
 - reporting_period_start (ISO date string - for JS Date)
 - reporting_period_end (ISO date string - for JS Date)
 - indicator_pks_level_order ([int])
 - indicator_pks_chain_order ([int])
 - needs_additional_target_periods (boolean)
 - indicators ([ProgramPageIndicator])

Program Page Indicator:
 - pk (int)
 - name (string)
 - level_pk (int)
 - long_number (string)
 - short_number (string)
 - old_level_name (string)
 - means_of_verification (string)
 - unit_of_measure (string)
 - is_percent (bool)
 - is_cumulative (bool)
 - direction_of_change ("+"/"-"/None)
 - baseline (int/float)
 - lop_target (int/float)