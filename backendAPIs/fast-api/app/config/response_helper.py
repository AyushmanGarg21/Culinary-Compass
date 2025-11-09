"""Response helper for standardized API responses."""
from typing import Any, Optional
from fastapi import status
from fastapi.responses import JSONResponse


class ResponseHelper:
    """Helper class for creating standardized API responses."""

    @staticmethod
    def success_response(
        data: Any = None,
        message: str = "Success",
        status_code: int = status.HTTP_200_OK
    ) -> JSONResponse:
        """
        Create a successful response with status code, message, and data.

        Args:
            data: The response data (can be dict, list, or any serializable object)
            message: Success message
            status_code: HTTP status code (default: 200)

        Returns:
            JSONResponse with standardized format
        """
        response_content = {
            "status_code": status_code,
            "message": message,
            "data": data
        }
        return JSONResponse(
            status_code=status_code,
            content=response_content
        )

    @staticmethod
    def created_response(
        data: Any = None,
        message: str = "Resource created successfully"
    ) -> JSONResponse:
        """
        Create a 201 Created response.

        Args:
            data: The created resource data
            message: Success message

        Returns:
            JSONResponse with 201 status code
        """
        return ResponseHelper.success_response(
            data=data,
            message=message,
            status_code=status.HTTP_201_CREATED
        )

    @staticmethod
    def ok_response(
        data: Any = None,
        message: str = "Request successful"
    ) -> JSONResponse:
        """
        Create a 200 OK response.

        Args:
            data: The response data
            message: Success message

        Returns:
            JSONResponse with 200 status code
        """
        return ResponseHelper.success_response(
            data=data,
            message=message,
            status_code=status.HTTP_200_OK
        )

    @staticmethod
    def no_content_response(
        message: str = "No content"
    ) -> JSONResponse:
        """
        Create a 204 No Content response.

        Args:
            message: Success message

        Returns:
            JSONResponse with 204 status code
        """
        return ResponseHelper.success_response(
            data=None,
            message=message,
            status_code=status.HTTP_204_NO_CONTENT
        )
