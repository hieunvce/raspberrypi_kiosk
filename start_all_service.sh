#!/bin/bash

systemctl --user enable kiosk
systemctl --user start kiosk

systemctl --user enable pocketbase
systemctl --user start pocketbase
