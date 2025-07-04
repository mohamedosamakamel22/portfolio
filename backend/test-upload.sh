#!/bin/bash

# Download a test image if it doesn't exist
if [ ! -f "test-image.jpg" ]; then
  curl -o test-image.jpg https://picsum.photos/200/300
fi

# Perform the upload
curl --location 'http://localhost:3000/api/albums' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODVmYzcyNTA2NjdmMmRiMWJkN2NmYzciLCJlbWFpbCI6IlNhZWVkU2Vra2FAZW1haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzUxMTE0MTEzfQ.w8aBrwSpgw-EprJNUsL82TfNW39C9IxwUX9J48kMiMQ' \
-F "title=My Photography Album" \
-F "description=A beautiful collection" \
-F "coverImage=@test-image.jpg;type=image/jpeg" \
-F "images=@test-image.jpg;type=image/jpeg" \
-F "tags=Travel,Photography" \
-F 'features=[{"icon":"📸","title":"Camera","value":"Canon EOS R5"}]' 