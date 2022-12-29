#!/bin/sh

# Validation.
if [ ! $APPINSIGHTS_INSTRUMENTATIONKEY ];
then
    echo "Warning: Application Insights is not setup.  Application will log to console."
fi

# Run app.
exec env APPINSIGHTS_INSTRUMENTATIONKEY=$(cat $APPINSIGHTS_INSTRUMENTATIONKEY) env REDIS_PASSWORD=$(cat $REDIS_PASSWORD_FILE) env WEB_TRACKER_PASSWORD=$(cat $WEB_TRACKER_PASSWORD_FILE) node index
