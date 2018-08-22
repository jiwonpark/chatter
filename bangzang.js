function Bangzang() {
    this.operation = {
        register: '>>입장',
        success: '>>완료',
        terminate: '>>종료',
        start: '>>시작'
    };
    this.members = [];
    this.mission = {
        isActive: false,
        successMember: [],
        congraturations: "모두 성공하셨습니다 수고하셨습니다!"
    };
    this.mqttClient;
    this.mqttTopic;
}

Bangzang.prototype.setMqttClient = function (client, topic, nickname) {
    this.mqttClient = client;
    this.mqttTopic = topic;
    this.mqttClient.publish(this.mqttTopic, `방장(${nickname})이 입장하였습니다. 새로 입장해주세요.\n입장 + enter`);
}

Bangzang.prototype.checkSpecialOperation = function (message) {
    var nickname;

    if (message.length - message.indexOf(this.operation.register) == 4) {
        nickname = message.slice(0, message.indexOf(this.operation.register));
        for (var i = 0; i < this.members.length; i++) {
            if (this.members[i] == nickname) {
                return true;
            }
        }
    
        this.members.push(nickname);
        this.mqttClient.publish(this.mqttTopic, `방장>>${nickname}님 입장하셨습니다.`);
        this.mqttClient.publish(this.mqttTopic, '=============================================');
        console.log('Current Members : ' +this.members.join(' , '));
        return true;
    }

    if (message.length - message.indexOf(this.operation.success) == 4) {
        nickname = message.slice(0, message.indexOf(this.operation.success));
        if (this.mission.isActive) {
            this.successMission(nickname);
            return true;
        }
    }

    if (message.length - message.indexOf(this.operation.terminate) == 4) {
        nickname = message.slice(0, message.indexOf(this.operation.terminate));
        this.terminateMission();
        return true;
    }

    if (message.length - message.indexOf(this.operation.start) == 4) {
        nickname = message.slice(0, message.indexOf(this.operation.start));
        this.startMission();
        return true;
    }

    return false;
}

Bangzang.prototype.successMission = function (nickname) {
    var ranking;

    for (var i = 0; this.mission.successMember.length; i++) {
        if (this.mission.successMember[i] == nickname) {
            this.mqttClient.publish(this.mqttTopic, `방장>>${nickname}님 ${i + 1}등 입니다! 축하합니다.`);
            return;
        }
    }

    this.mission.successMember.push(nickname);
    ranking = this.mission.successMember.length;

    this.mqttClient.publish(this.mqttTopic, `방장>>${nickname}님 ${ranking}등 입니다! 축하합니다.`);

    if (this.mission.successMember.length >= this.members.length) {
        this.mqttClient.publish(this.mqttTopic, this.mission.congraturations);
        this.mqttClient.publish(this.mqttTopic, '=============================================');
        this.mission.successMember = [];
        this.mission.isActive = false;    
    }
}

Bangzang.prototype.startMission = function () {
    this.mission.successMember = [];
    this.mission.isActive = true;
    this.mqttClient.publish(this.mqttTopic, `방장>>미션이 시작되었습니다. 화이팅!`);
    this.mqttClient.publish(this.mqttTopic, '=============================================');
}

Bangzang.prototype.terminateMission = function () {
    this.mqttClient.publish(this.mqttTopic, `미션을 종료합니다!`);
    for (var i = 0; i < this.mission.successMember.length; i++) {
        this.mqttClient.publish(this.mqttTopic, `${this.mission.successMember[i]} 미션 성공!`);
    }

    this.mqttClient.publish(this.mqttTopic, '=============================================');
    this.mission.successMember = [];
    this.mission.isActive = false;
}

module.exports = new Bangzang();
