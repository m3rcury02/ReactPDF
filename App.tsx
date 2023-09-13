import React, { useState } from 'react';
import { View, Button, Dimensions, Linking, Text, TouchableOpacity } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import Pdf from 'react-native-pdf';
import RNFS from 'react-native-fs';

const App = () => {
  const [pdfUri, setPdfUri] = useState('');

  const selectFile = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf],
      });
  
      const destPath = `${RNFS.DocumentDirectoryPath}/${res.name}`;
  
      await RNFS.copyFile(res.uri, destPath)
  
      setPdfUri(`file://${destPath}`);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
      } else {
        throw err;
      }
    }
  };


  return (
    <View style={{flex: 1, justifyContent: 'flex-start', alignItems: 'center'}}>
      <Button title="Pick PDF" onPress={selectFile} />
      <Pdf
        trustAllCerts={false}
        source={{
          uri: pdfUri,
        }}
        page={1}
        scale={1.0}
        minScale={0.5}
        maxScale={3.0}
        enablePaging={true}
        onPageSingleTap={(page) => alert(page)}
        onPressLink={(link) => Linking.openURL(link)}
        // singlePage={true}
        spacing={10}
        // horizontal
        style={{flex: 1, width: Dimensions.get('window').width}}
      />
      {pdfUri !== '' && (
        <TouchableOpacity
          onPress={async () => {
            const destPath = `${RNFS.DownloadDirectoryPath}/Pdf Download.pdf`;
            const pdfData = await RNFS.readFile(pdfUri, 'base64');
            await RNFS.writeFile(destPath, pdfData, 'base64');
            console.log(`PDF saved to: ${destPath}`);
          }}
          style={{
            position: 'absolute',
            width: 60,
            height: 60,
            alignItems: 'center',
            justifyContent: 'center',
            right: 30,
            bottom: 30,
            backgroundColor: '#0A84FF',
            borderRadius: 30,
            elevation: 10
          }}
        >
          <Text style={{ color: 'white', fontSize: 18 }}>Save</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default App;

