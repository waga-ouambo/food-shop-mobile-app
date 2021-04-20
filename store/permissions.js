import * as Notification from 'expo-notifications'; 

export const getNotificationPermissionsToken = async  () => {
    try {
        let token;
      const settings = await Notification.getPermissionsAsync(); 
      let response; 
      if(!settings.granted || !(settings.ios?.status === Notification.IosAuthorizationStatus.PROVISIONAL)) { 
        response = await Notification.requestPermissionsAsync({
            ios: {
              allowAlert: true,
              allowBadge: true,
              allowSound: true,
              allowAnnouncements: true,
            },
          });
      } 
        if(response.status !== 'granted'){
            token = null;
            throw new Error('Permission not granted !');
        }  
        
        const expoToken = await Notification.getExpoPushTokenAsync();
        token = expoToken.data; 
        return token;

    } catch (error) { 
      throw error;
    } 
} 