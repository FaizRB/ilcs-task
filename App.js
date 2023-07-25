import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Button,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  FlatList
} from "react-native";
import axios from "axios";

const FormComponent = () => {
  const [dataNegara, setDataNegara] = useState([]);
  const [selectNegara, setSelectNegara] = useState({});
  const [negara, setNegara] = useState("");
  const [dataPelabuhan, setDataPelabuhan] = useState([]);
  const [pelabuhan, setPelabuhan] = useState("");
  const [barang, setBarang] = useState("");
  const [uraian, setUraian] = useState("");
  const [harga, setHarga] = useState("");
  const [persentase, setPersentase] = useState("");
  const [tarif, setTarif] = useState("");

  const submitForm = () => {
    const formValues = {
      negara,
      pelabuhan,
      barang,
      uraian,
      harga,
      persentase,
      tarif
    };
    console.log(formValues);
  };

  useEffect(() => {
    if (negara.length >= 3) {
      fetchDataNegara();
    }

    if (pelabuhan.length >= 3) {
      fetchDataPel();
    }

    if (barang.length >= 3) {
      fetchDataur();
    }
  });

  const fetchDataNegara = async () => {
    try {
      const response = await axios.get(
        `https://insw-dev.ilcs.co.id/n/negara?ur_negara=${negara}`
      );
      setDataNegara(response.data.data);
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  const onSelectNegara = (item) => {
    setNegara(item.ur_negara);
    setSelectNegara(item);
  };

  const filterNegara = dataNegara.filter((item, i) => {
    return item.ur_negara.toLowerCase().includes(negara.toLowerCase());
  });

  const fetchDataPel = async () => {
    try {
      let kode = selectNegara.kd_negara;
      const response = await axios.get(
        `https://insw-dev.ilcs.co.id/n/pelabuhan?kd_negara=${kode}&ur_pelabuhan=${pelabuhan}`
      );
      setDataPelabuhan(response.data.data);
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  const onSelectPelabuhan = (item) => {
    setPelabuhan(item.ur_pelabuhan);
  };

  const filterPelabuhan = dataPelabuhan.filter((item) => {
    return item.ur_pelabuhan.toLowerCase().includes(pelabuhan);
  });

  const fetchDataur = async () => {
    try {
      let kode = barang;
      const response = await axios.get(
        `https://insw-dev.ilcs.co.id/n/barang?hs_code=${kode}`
      );
      setUraian(response.data.data[0].uraian_id);
      persenTase();
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  const persenTase = async () => {
    try {
      const response = await axios.get(
        `https://insw-dev.ilcs.co.id/n/tarif?hs_code=${barang}`
      );
      let persen = (response.data.data[0].bm / 100) * harga;
      setPersentase(response.data.data[0].bm);
      setTarif(persen);
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  return (
    <View style={{ margin: 20 }}>
      <View>
        <Text>Negara</Text>
        <TextInput
          style={styles.input}
          value={negara}
          onChangeText={setNegara}
        />
        <FlatList
          data={filterNegara}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => onSelectNegara(item)}>
              <Text>{item.ur_negara}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <View>
        <Text>Pelabuhan</Text>
        <TextInput
          style={styles.input}
          value={pelabuhan}
          onChangeText={setPelabuhan}
        />

        <FlatList
          data={filterPelabuhan}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => onSelectPelabuhan(item)}>
              <Text>{item.ur_pelabuhan}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <Text>Barang</Text>
      <TextInput style={styles.input} value={barang} onChangeText={setBarang} />

      <TextInput
        style={styles.inputdesc}
        value={uraian}
        onChangeText={setUraian}
        multiline
      />
      <Text>Harga</Text>
      <TextInput
        style={styles.input}
        value={harga}
        onChangeText={setHarga}
        keyboardType="numeric"
      />
      <Text>Tarif Bea Masuk</Text>
      <TextInput
        style={styles.input}
        value={persentase}
        onChangeText={setPersentase}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        value={tarif}
        onChangeText={setTarif}
        keyboardType="numeric"
      />
      <Button title="Submit" onPress={submitForm} />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingLeft: 10,
    marginBottom: 16
  },

  inputdesc: {
    height: 80,
    borderColor: "gray",
    borderWidth: 1,
    paddingLeft: 10,
    marginBottom: 16
  }
});

export default FormComponent;
