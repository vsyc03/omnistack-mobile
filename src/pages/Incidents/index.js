import React, { useState, useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { View, FlatList, Image, Text, TouchableOpacity } from 'react-native';

import api from '../../services/api';
import styles from './styles';
import logoImg from '../../assets/logo.png';

function Incidents() {
    const [incidents, setIncidents] = useState([]);
    const [total, setTotal] = useState(0);
    const navigation = useNavigation();
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    function navigateToDetail(incident) {
        navigation.navigate('Detail', { incident });
    }

    function loadIncidents() {
        if(loading) {
            return;
        }

        if(total > 0 && incidents.length === total) {
            return;
        }

        setLoading(true);

        try {
            api.get(`incidents?page=${page}`).then(res => {
                setIncidents([...incidents, ...res.data]);
                setTotal(res.headers['x-total-count']);
            })
        } catch(err) {
            alert('Não foi possível carregar a lista de casos, tente novamente mais tarde.');
        }

        setLoading(false);
        setPage(page + 1);
    }

    useEffect(() => {
        loadIncidents();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={logoImg} />
                <Text style={styles.headerText}>
                    Total de <Text style={styles.headerTextBold}>{total} casos</Text>.
                </Text>
            </View>

            <Text style={styles.title}>Bem-vindo!</Text>
            <Text style={styles.description}>Escolha um dos casos abaixo e salve o dia.</Text>

            <FlatList style={styles.incidentList} data={incidents} keyExtractor={incident => String(incident.id)} showsVerticalScrollIndicator={false} onEndReached={loadIncidents} onEndReachedThreshold={0.2 } renderItem={({ item: incident }) => (
                <View style={styles.incident}>
                    <Text style={styles.incidentProperty}>ONG:</Text>
                    <Text style={styles.incidentValue}>{incident.name}</Text>
                    <Text style={styles.incidentProperty}>CASO:</Text>
                    <Text style={styles.incidentValue}>{incident.description}</Text>
                    <Text style={styles.incidentProperty}>VALOR:</Text>
                    <Text style={styles.incidentValue}>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL'}).format(incident.value)}</Text>
                    <TouchableOpacity style={styles.detailsButton} onPress={() => navigateToDetail(incident)}>
                        <Text style={styles.detailsButtonText}>Ver mais detalhes</Text>
                        <Feather name="arrow-right" size={17} color='#e02041' />
                    </TouchableOpacity>
                </View>
            )} />
        </View>
    );
}

export default Incidents;