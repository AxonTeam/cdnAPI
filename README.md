# cdnAPI
AxonTeam cdnAPI that serves cdn.axonteam.org

# Normal paths

- `/images/` - Shows a official image.

- `/screenshots` - Shows a users screenshot.

# API paths (and method)

- POST `/images/` - Upload a image. Requires root or nucleus token.

- DELETE `/images/:id` - Delete a image. Requires root or nucleus token.

## Images api endpoints - in depth

When requesting, if you want you can specify a name for the image (in the body)

When requesting, if you want to upload/delete a banner or a logo, you specify the type (in the body).

- Types can be logo or banner.

## Bad to endpoints

- POST `/screnshots/` - Upload a screenshot. Requires either your authorization, or nucleus authorization (not implemented).

- DELETE `/screenshots/:id` - Delete a screenshot. Requires either your authorization or nucleus authorization (not implemented).

# Config keys/values

- `url` - Defines the URL to return when a image or screenshot was successfully uploaded.

- `port` - What port you are going to listen to