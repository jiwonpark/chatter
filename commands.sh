cd tts-mqtt-test; \
rm -r .sign; \
rm -r Debug; \
rm -r SA_Report; \
cd -; \
rm tts-mqtt.zip;\
zip -r tts-mqtt.zip publisher.js tts-mqtt-test \
    --exclude=chatter.zip \
    --exclude=*/.sign/* \
    --exclude=*/Debug/* \
    --exclude=*/SA_Report/* \
    --exclude=*/node_modules/* \
;\
rm -rf tts-mqtt-test; unzip tts-mqtt.zip; cmp tts-mqtt-test-orig tts-mqtt-test
