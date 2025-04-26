from django.shortcuts import render
import joblib
import numpy as np
import pandas as pd
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
import os

# Create your views here.

class PredictionView(APIView):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Load the model when the view is initialized
        model_path = os.path.join(settings.BASE_DIR, 'model.joblib')
        self.model = joblib.load(model_path)
        
        # Define the expected feature names in order
        self.feature_names = [
            "Unnamed: 0",
            "Drive Time",
            "Tilt",
            "Tilt2",
            "Azimuth",
            "Azimuth2",
            "Azimuth3",
            "Panel QTY",
            "System Rating (kW DC)",
            "Inverter Manufacturer",
            "Array Type",
            "Squirrel Screen",
            "Consumption Monitoring",
            "Truss / Rafter",
            "Reinforcements",
            "# of reinforcement",
            "Rough Electrical Inspection",
            "Interconnection Type",
            "Module Length",
            "Module Width",
            "Module Weight",
            "# of Arrays",
            "# of Circuits",
            "# of reinforcement",
            "Roof Type",
            "Attachment Type",
            "Portrait / Landscape",
            "# of Stories",
            "Install Season",
            "Total Direct Time for Hourly Employees (Including Drive Time)",
            "Total # of Days on Site",
            "Total # Hourly Empoyees on Site",
            "Estimated # of Salaried Employees on Site",
            "Estimated Salary Hours",
            "Estimated Total # of People on Site"
        ]

        # Default values from full_variable_numbers.txt
        self.default_values = {
            "Unnamed: 0": 138.00,
            "Drive Time": 26.32,
            "Tilt": 25.59,
            "Tilt2": 25.88,
            "Azimuth": 176.19,
            "Azimuth2": 172.71,
            "Azimuth3": 179.79,
            "Panel QTY": 21.37,
            "System Rating (kW DC)": 8.56,
            "Module Length": 72.42,
            "Module Width": 41.12,
            "Module Weight": 46.55,
            "# of Arrays": 1.79,
            "# of reinforcement": 1.49,
            "# of Stories": 1.38,
            "Total Direct Time for Hourly Employees (Including Drive Time)": 46.04,
            "Total # of Days on Site": 1.96,
            "Total # Hourly Empoyees on Site": 3.60,
            "Estimated # of Salaried Employees on Site": 0.88,
            "Estimated Salary Hours": 12.38,
            "Estimated Total # of People on Site": 4.48,
            "Inverter Manufacturer": 1,  # Enphase
            "Array Type": 1,  # Roof Mount
            "Squirrel Screen": 1,  # Yes
            "Consumption Monitoring": 0,  # No
            "Truss / Rafter": 1,  # Truss
            "Reinforcements": 0,  # No
            "Rough Electrical Inspection": 0,  # No
            "Interconnection Type": 1,  # A1
            "Roof Type": 1,  # Asphalt Shingles
            "Attachment Type": 1,  # Flashfoot 2
            "Portrait / Landscape": 1,  # Portrait
            "Install Season": 2,  # Summer
            "# of Circuits": 1  # Default to 1 if not specified
        }

    def post(self, request):
        try:
            # Get input data from request
            input_data = request.data
            
            # Create a dictionary with all features, using defaults for missing ones
            features_dict = {}
            for feature in self.feature_names:
                if feature in input_data.get('features', {}):
                    features_dict[feature] = input_data['features'][feature]
                else:
                    features_dict[feature] = self.default_values.get(feature, 0)
            
            # Add debug logging
            print("\n=== DEBUG: Features being sent to model ===")
            print("Input features from request:", input_data.get('features', {}))
            print("\nFinal features dict with defaults:", features_dict)
            print("=======================================\n")
            
            # Convert to DataFrame
            df = pd.DataFrame([features_dict])
            
            # Make prediction
            prediction = self.model.predict(df)
            
            # Return prediction
            return Response({
                'prediction': float(prediction[0]),
                'status': 'success',
                'used_defaults': [k for k, v in features_dict.items() if k not in input_data.get('features', {})]
            })
            
        except Exception as e:
            return Response({
                'error': str(e),
                'status': 'error'
            }, status=status.HTTP_400_BAD_REQUEST)
