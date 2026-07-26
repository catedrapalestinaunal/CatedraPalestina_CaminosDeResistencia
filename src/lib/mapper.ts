import type { ProjectKind, Event } from './types';
import type { ProjectRow, EventRow } from '../types/database';
import type { Project } from './types';
import { VALID_KINDS } from './constants';

export function toEvent(row: EventRow): Event {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    place: row.place ?? undefined,
    eventDate: row.event_date,
    eventTime: row.event_time ?? undefined,
    organizer: row.organizer ?? undefined,
    category: row.category ?? undefined,
    images: row.images ?? [],
  };
}

export function toProject(row: ProjectRow): Project {
  const kind: ProjectKind = VALID_KINDS.includes(row.kind as never)
    ? (row.kind as ProjectKind)
    : 'ensayo';

  return {
    id: row.id,
    kind,
    title: row.title,
    author: row.author,
    year: row.year,
    n: row.n,
    tags: row.tags,
    description: row.description ?? undefined,
    url: row.url ?? undefined,
    urlAlt: row.url_alt ?? undefined,
    links: row.links ?? undefined,
    linkLabel: row.link_label ?? undefined,
    thumbnail: row.thumbnail ?? undefined,
    aiThumbnail: row.ai_thumbnail,
    members: row.members,
    group: row.group_name ?? undefined,
  };
}
