import re
from presidio_analyzer import AnalyzerEngine
from presidio_anonymizer import AnonymizerEngine

class PIIMasker:
    """
    PIIMasker class for detecting and masking Personally Identifiable Information (PII).
    This class uses Presidio's AnalyzerEngine and AnonymizerEngine for PII detection and anonymization.
    """

    def __init__(self):
        """
        Initialize the PIIMasker with Presidio's AnalyzerEngine and AnonymizerEngine.
        """
        self.analyzer = AnalyzerEngine()
        self.anonymizer = AnonymizerEngine()

    def detect_pii(self, text, language="en"):
        """
        Detect PII entities in the given text.

        Args:
            text (str): The input text to analyze.
            language (str): The language of the text. Default is "en".

        Returns:
            list: A list of detected PII entities with their types, start, and end positions.
        """
        results = self.analyzer.analyze(text=text, entities=[], language=language)
        return [{"entity_type": result.entity_type, "start": result.start, "end": result.end} for result in results]

    def mask_pii(self, text, language="en"):
        """
        Mask PII entities in the given text.

        Args:
            text (str): The input text to anonymize.
            language (str): The language of the text. Default is "en".

        Returns:
            str: The anonymized text with PII entities masked.
        """
        results = self.analyzer.analyze(text=text, entities=[], language=language)
        anonymized_text = self.anonymizer.anonymize(text=text, analyzer_results=results).text
        return anonymized_text

    def mask_pii_with_custom_pattern(self, text, pattern, replacement="***"):
        """
        Mask PII entities in the given text using a custom regex pattern.

        Args:
            text (str): The input text to anonymize.
            pattern (str): The regex pattern to identify PII.
            replacement (str): The replacement string for the identified PII. Default is "***".

        Returns:
            str: The anonymized text with custom PII entities masked.
        """
        return re.sub(pattern, replacement, text)
