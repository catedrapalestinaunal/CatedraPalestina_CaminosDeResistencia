import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Faltan VITE_SUPABASE_URL o SUPABASE_SERVICE_KEY en .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const EVENTS = [
  {
    title: 'Conferencia: Palestina y el derecho internacional',
    description: 'Una mirada desde el sur global a las violaciones sistemáticas del derecho internacional en Palestina. Participan juristas de la UNAL, la Universidad de los Andes y la Comisión Colombiana de Juristas.',
    place: 'Auditorio principal · Facultad de Derecho',
    event_date: '2026-09-15',
    event_time: '10:00 - 12:30',
    organizer: 'Cátedra Caminos de Resistencia',
    category: 'conferencia',
    images: [],
  },
  {
    title: 'Taller: Cartografía del bloqueo',
    description: 'Taller práctico de mapeo colaborativo sobre la infraestructura del bloqueo en Gaza. Se trabajará con datos abiertos y herramientas deOSM.',
    place: 'Sala de cómputo 3 · Edificio de Ingeniería',
    event_date: '2026-10-02',
    event_time: '14:00 - 17:00',
    organizer: 'Colectivo de Geografía Crítica',
    category: 'taller',
    images: [],
  },
  {
    title: 'Proyección: Gaza Mon Amour',
    description: 'Proyección del largometraje palestino seguida de conversatorio con el director vía streaming.',
    place: 'Auditorio central · Edificio de Ciencias Humanas',
    event_date: '2026-10-20',
    event_time: '18:00',
    organizer: 'Cátedra Caminos de Resistencia · Cine Foro UNAL',
    category: 'proyeccion',
    images: [],
  },
];

async function main() {
  console.log(`Insertando ${EVENTS.length} eventos...`);

  for (const event of EVENTS) {
    const { data, error } = await supabase
      .from('events')
      .insert(event)
      .select()
      .single();

    if (error) {
      console.error(`Error al insertar "${event.title}":`, error.message);
    } else {
      console.log(`✓ ${data.title} (${data.event_date})`);
    }
  }

  console.log('Done.');
}

main().catch(console.error);
