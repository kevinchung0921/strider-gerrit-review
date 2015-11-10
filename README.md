# strider-gerrit-review

This is a gerrit review plugin which will post review comment and vote to gerrit 
according the test result. 

## User Guide

In console:
1. Copy the hook scripts under /gerrit-hooks to your gerrit install path's '/hooks' directory
2. Make the scripts executable
3. Change the Strider username, password, url and repo according your Strider setting

In Strider UI:
1. Drag Gerrit Review plugin into your plugin list
2. Select the Gerrit Review plugin in the left panel, start to configure it
3. Fill in the Gerrit URL, user name and password. 