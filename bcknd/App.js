import { useState,useEffect } from 'react';
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity } from 'react-native';
import Ip from './Ip';

export default function App() {
  const [adatok,setAdatok]=useState([])

  const letoltes=async ()=>{
      const x=await fetch(Ip.Ipcim+"film")
      const y=await x.json()
      setAdatok(y)
      //alert(JSON.stringify(y))
  }

  useEffect(()=>{
      letoltes()
  },[])

  const szavazas=async (id)=>{
    //alert(id)
    var bemenet={
      "bevitel1":id
    }
    const x=await fetch(Ip.Ipcim+"/szavazatFelvitel",
    {
      method: "POST",
      body: JSON.stringify(bemenet),
      headers: {"Content-type": "application/json; charset=UTF-8"}
  }
    )
    const y=await x.text()
    alert(y)
  }

  return (
    <View style={styles.container}>
      <Text>Marvel filmek</Text>
      <FlatList
        data={adatok}
        renderItem={({item}) => (
            <View>
                <Text>{item.film_cim}</Text>
    
                <Image 
                source={{uri: Ip.Ipcim+item.film_kep}} 
                style={{width:100, height:200}}/>

                <TouchableOpacity 
                    style={{backgroundColor:"#0000ff"}} 
                    onPress={()=>szavazas(item.film_id)}>
                  <Text style={{color:"white"}}>Erre szavazok</Text>
                </TouchableOpacity>
            
            </View>
          )
        }
        keyExtractor={item => item.film_id}
      />
     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginTop:50
  },
});
