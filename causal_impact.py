import pandas as pd
import numpy as np
from causalimpact import CausalImpact
from datetime import datetime, timedelta
import json

class DealerImpactAnalyzer:
    def __init__(self):
        pass
    
    def prepare_data(self, dealer_data, start_date, end_date, intervention_date):
        """
        Prepare data for causal impact analysis
        
        Parameters:
        -----------
        dealer_data: dict
            Dictionary containing 'dates', 'leads', 'sales', and 'baseline_sales'
        start_date: str
            Start date for analysis in format 'YYYY-MM-DD'
        end_date: str
            End date for analysis in format 'YYYY-MM-DD'
        intervention_date: str
            Date when CarReport integration started in format 'YYYY-MM-DD'
            
        Returns:
        --------
        pd.DataFrame
            DataFrame with dates as index and leads, sales, and baseline_sales as columns
        """
        df = pd.DataFrame({
            'date': pd.to_datetime(dealer_data['dates']),
            'leads': dealer_data['leads'],
            'sales': dealer_data['sales'],
            'baseline_sales': dealer_data['baseline_sales']
        })
        
        df.set_index('date', inplace=True)
        df = df.sort_index()
        
        # Ensure we have data for the full date range
        date_range = pd.date_range(start=start_date, end=end_date)
        df = df.reindex(date_range)
        
        # Fill missing values with interpolation
        df = df.interpolate(method='linear')
        
        return df
    
    def run_causal_impact_analysis(self, data, pre_period, post_period):
        """
        Run causal impact analysis
        
        Parameters:
        -----------
        data: pd.DataFrame
            DataFrame with dates as index and leads, sales, and baseline_sales as columns
        pre_period: list
            List of two dates [start_date, intervention_date - 1 day]
        post_period: list
            List of two dates [intervention_date, end_date]
            
        Returns:
        --------
        CausalImpact
            CausalImpact object with analysis results
        """
        # Prepare data for CausalImpact
        impact_data = pd.DataFrame({
            'y': data['sales'],
            'x1': data['baseline_sales']
        })
        
        # Run causal impact analysis
        ci = CausalImpact(impact_data, pre_period, post_period)
        
        return ci
    
    def generate_impact_summary(self, ci, average_order_value, average_margin):
        """
        Generate a summary of the causal impact analysis
        
        Parameters:
        -----------
        ci: CausalImpact
            CausalImpact object with analysis results
        average_order_value: float
            Average order value for the dealer
        average_margin: float
            Average margin per sale for the dealer
            
        Returns:
        --------
        dict
            Dictionary with summary statistics
        """
        # Extract key metrics from the causal impact analysis
        summary_data = ci.summary_data
        
        # Calculate additional business metrics
        absolute_effect = summary_data.loc["average", "abs_effect"]
        relative_effect = summary_data.loc["average", "rel_effect"]
        
        # Calculate the number of additional sales attributable to CarReport
        additional_sales = absolute_effect * len(ci.params["post_period_response"])
        
        # Calculate revenue and margin impact
        revenue_impact = additional_sales * average_order_value
        margin_impact = additional_sales * average_margin
        
        # Create summary dictionary
        summary = {
            "total_observed_sales": float(summary_data.loc["average", "actual"]) * len(ci.params["post_period_response"]),
            "predicted_sales_without_carreport": float(summary_data.loc["average", "pred"]) * len(ci.params["post_period_response"]),
            "additional_sales_from_carreport": float(additional_sales),
            "relative_effect_percentage": float(relative_effect) * 100,
            "confidence_interval": [
                float(summary_data.loc["lower", "rel_effect"] * 100),
                float(summary_data.loc["upper", "rel_effect"] * 100)
            ],
            "revenue_impact": float(revenue_impact),
            "margin_impact": float(margin_impact),
            "average_order_value": float(average_order_value),
            "average_margin": float(average_margin),
            "p_value": float(summary_data.loc["average", "p"]),
            "is_statistically_significant": float(summary_data.loc["average", "p"]) < 0.05
        }
        
        return summary
    
    def generate_impact_data_for_chart(self, ci):
        """
        Generate data for charting the causal impact
        
        Parameters:
        -----------
        ci: CausalImpact
            CausalImpact object with analysis results
            
        Returns:
        --------
        dict
            Dictionary with data for charts
        """
        # Extract data from the causal impact analysis
        data = ci.data
        
        # Convert to lists for JSON serialization
        dates = data.index.strftime('%Y-%m-%d').tolist()
        actual = data['y'].tolist()
        predicted = data['preds'].tolist()
        point_effects = data['point_effects'].tolist()
        cumulative_effects = data['cum_effects'].tolist()
        
        # Get confidence intervals
        lower_bound = data['preds_lower'].tolist()
        upper_bound = data['preds_upper'].tolist()
        
        # Create chart data dictionary
        chart_data = {
            "dates": dates,
            "actual": actual,
            "predicted": predicted,
            "lower_bound": lower_bound,
            "upper_bound": upper_bound,
            "point_effects": point_effects,
            "cumulative_effects": cumulative_effects,
            "intervention_date": ci.params["pre_period"][1]
        }
        
        return chart_data
    
    def analyze_dealer_impact(self, dealer_data, start_date, end_date, intervention_date, average_order_value, average_margin):
        """
        Analyze the causal impact of CarReport on dealer sales
        
        Parameters:
        -----------
        dealer_data: dict
            Dictionary containing 'dates', 'leads', 'sales', and 'baseline_sales'
        start_date: str
            Start date for analysis in format 'YYYY-MM-DD'
        end_date: str
            End date for analysis in format 'YYYY-MM-DD'
        intervention_date: str
            Date when CarReport integration started in format 'YYYY-MM-DD'
        average_order_value: float
            Average order value for the dealer
        average_margin: float
            Average margin per sale for the dealer
            
        Returns:
        --------
        dict
            Dictionary with summary and chart data
        """
        # Prepare data
        data = self.prepare_data(dealer_data, start_date, end_date, intervention_date)
        
        # Define pre and post periods
        pre_period = [start_date, (pd.to_datetime(intervention_date) - timedelta(days=1)).strftime('%Y-%m-%d')]
        post_period = [intervention_date, end_date]
        
        # Run causal impact analysis
        ci = self.run_causal_impact_analysis(data, pre_period, post_period)
        
        # Generate summary and chart data
        summary = self.generate_impact_summary(ci, average_order_value, average_margin)
        chart_data = self.generate_impact_data_for_chart(ci)
        
        # Combine results
        result = {
            "summary": summary,
            "chart_data": chart_data,
            "report_text": self.generate_report_text(summary, intervention_date, end_date)
        }
        
        return result
    
    def generate_report_text(self, summary, intervention_date, end_date):
        """
        Generate a human-readable report text
        
        Parameters:
        -----------
        summary: dict
            Dictionary with summary statistics
        intervention_date: str
            Date when CarReport integration started
        end_date: str
            End date for analysis
            
        Returns:
        --------
        str
            Human-readable report text
        """
        start_date_obj = pd.to_datetime(intervention_date)
        end_date_obj = pd.to_datetime(end_date)
        days_diff = (end_date_obj - start_date_obj).days
        
        # Format numbers for display
        additional_sales = round(summary["additional_sales_from_carreport"], 1)
        total_sales = round(summary["total_observed_sales"], 1)
        revenue_impact = f"${int(summary['revenue_impact']):,}"
        margin_impact = f"${int(summary['margin_impact']):,}"
        aov = f"${int(summary['average_order_value']):,}"
        avg_margin = f"${int(summary['average_margin']):,}"
        
        # Confidence statement
        confidence_statement = ""
        if summary["is_statistically_significant"]:
            confidence_statement = f"This result is statistically significant (p-value: {summary['p_value']:.3f})."
        else:
            confidence_statement = f"This result is not yet statistically significant (p-value: {summary['p_value']:.3f}). More data may be needed."
        
        # Generate report text
        report_text = f"""
        In the last {days_diff} days since integrating with CarReport on {intervention_date}, your dealership has seen {total_sales} total sales.
        
        Our analysis shows that approximately {additional_sales} of these sales ({summary['relative_effect_percentage']:.1f}%) would not have happened without CarReport.
        
        With an average order value of {aov} and an average margin of {avg_margin} per vehicle, CarReport has generated approximately {margin_impact} in additional profit for your dealership.
        
        {confidence_statement}
        """
        
        return report_text.strip()

