import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { GraphNode, GraphEdge, VisualizationStep } from '../types';


const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica', // Fuente 
    fontSize: 11,
    color: '#333',
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    color: '#1a5f7a',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    borderBottom: '2px solid #1a5f7a',
    paddingBottom: 4,
    color: '#1a5f7a',
  },
  subTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  text: {
    marginBottom: 4,
  },
  bold: {
    fontWeight: 'bold',
  },
  resultText: {
    fontSize: 12,
    color: '#0d7a5f',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  logContainer: {
    borderLeft: '2px solid #eee',
    paddingLeft: 10,
    marginTop: 10,
  },
  logLine: {
    fontFamily: 'Courier',
    fontSize: 9,
    marginBottom: 3,
    color: '#555',
  },
  logHighlight: {
    color: '#0d7a5f',
    fontWeight: 'bold',
  }
});

interface ReportePDFProps {
    operationName: string;
    nodes: GraphNode[];
    edges: GraphEdge[];
    summarySteps: string[];
    finalStep: VisualizationStep | null;
    startNode?: number;
    endNode?: number;
}

export const ReportePDF: React.FC<ReportePDFProps> = ({ 
    operationName, 
    nodes, 
    edges,
    summarySteps,
    finalStep,
    startNode,
    endNode
}) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Text style={styles.header}>Reporte de Algoritmo: {operationName}</Text>
            
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Resumen del Grafo</Text>
                <Text style={styles.text}><Text style={styles.bold}>Nodos:</Text> {nodes.length} ({nodes.map(n => n.id).join(', ')})</Text>
                <Text style={styles.text}><Text style={styles.bold}>Aristas:</Text> {edges.length}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Parámetros de Ejecución</Text>
                {startNode !== undefined && <Text style={styles.text}><Text style={styles.bold}>Nodo de Inicio:</Text> {startNode}</Text>}
                {endNode !== undefined && <Text style={styles.text}><Text style={styles.bold}>Nodo de Destino:</Text> {endNode}</Text>}
                <Text style={styles.text}><Text style={styles.bold}>Fecha:</Text> {new Date().toLocaleString()}</Text>
            </View>
            
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Resultado Final</Text>
                {finalStep?.graphState?.highlightedPath && (
                    <Text style={styles.resultText}>
                        Camino Encontrado: {finalStep.graphState.highlightedPath.join(' → ')}
                    </Text>
                )}
                {finalStep?.graphState?.mstTotalWeight !== undefined && (
                     <Text style={styles.resultText}>
                        Peso Total del MST: {finalStep.graphState.mstTotalWeight}
                    </Text>
                )}
                <Text style={styles.text}>{finalStep?.explanation || 'Ejecución completada.'}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Log de Ejecución Detallado</Text>
                <View style={styles.logContainer}>
                    {summarySteps.map((step, index) => {
                        const isHighlight = step.toLowerCase().includes('¡') || step.toLowerCase().includes('encontrado');
                        return (
                            <Text key={index} style={[styles.logLine, isHighlight ? styles.logHighlight : {}]}>
                                {step}
                            </Text>
                        )
                    })}
                </View>
            </View>
        </Page>
    </Document>
);