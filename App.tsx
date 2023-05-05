import { useEffect } from 'react';
import { Text, View, Button } from 'react-native';
import notifee, {AndroidImportance, EventType, TimestampTrigger, TriggerType} from '@notifee/react-native';

import { styles } from './styles';

/* 
  A LIB QUE VAMOS USAR É 
  https://notifee.app/
  https://docs.expo.dev/versions/latest/sdk/build-properties/
*/

export default function App() {


  async function createChannel() {
    const channelId = await notifee.createChannel({
      id: 'teste',
      name: 'sales',
      vibration: true,
      importance: AndroidImportance.HIGH
    });

    return channelId;
  }

  async function displayNotication() {
    await notifee.requestPermission();

    const channelId = await createChannel();

    await notifee.displayNotification({
      id: '7',
      title: `Olá, tiago`,
      body: `Opa, uai só primeiro`,
      android: {
        channelId
      }
    });
  }

  async function updateNotification() {

    await notifee.requestPermission();

    const channelId = await createChannel();

    await notifee.displayNotification({
      id: '7',
      title: `Olá, tiago eee`,
      body: `Opa, uai só primeiro`,
      android: {
        channelId
      }
    });

  }
  
  async function cancelNotification() {
    // da para cancelar uma notificação agendada,
    // só pegar o id que é gerado automaticamente
    await notifee.cancelNotification('7');
  }

  // agendar uma notificação
  async function scheduleNotification() {
    const date = new Date(Date.now());

    date.setMinutes(date.getMinutes() + 1);

    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: date.getTime()
    }

    const channelId = await createChannel();

    await notifee.createTriggerNotification({
      title: 'Notificação agendada!',
      body: 'Essa é uma notificação agendada.',
      android: {
        channelId
      }
    }, trigger)
  }

  function listScheduleNotification() {
    notifee.getTriggerNotificationIds().then(ids => console.log(ids));
  }

  useEffect(() => {
    return notifee.onForegroundEvent(({ type,  detail }) => {
      switch (type) {
        case EventType.DISMISSED:
          console.log('Usuário descartou a notificação!');
          break;
        case EventType.ACTION_PRESS:
          console.log('Usuário tocou a notificação!', detail.notification);
          
      }
    });
  },[]);

  useEffect(() => {
    return notifee.onBackgroundEvent( async ({ type,  detail }) => {
      if(type === EventType.PRESS) {
        console.log('Usuário(1) tocou a notificação!', detail.notification); 
      }
    });
  },[]);

  return (
    <View style={styles.container}>
      <Text>Local</Text>
      <Button title='Enviar Notificação' onPress={displayNotication} />
      <Button title='Atualizar Notificação' onPress={updateNotification} />
      <Button title='Cancelar Notificação' onPress={cancelNotification} />
      <Button title='Agendar Notificação' onPress={scheduleNotification} />
      <Button title='Listar Notificação' onPress={listScheduleNotification} />
    </View>
  );
}
