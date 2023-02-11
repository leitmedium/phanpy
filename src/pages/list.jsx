import { useEffect, useRef, useState } from 'preact/hooks';
import { useParams } from 'react-router-dom';

import Icon from '../components/icon';
import Link from '../components/link';
import Timeline from '../components/timeline';
import { api } from '../utils/api';
import useTitle from '../utils/useTitle';

const LIMIT = 20;

function List() {
  const { masto } = api();
  const { id } = useParams();
  const listIterator = useRef();
  async function fetchList(firstLoad) {
    if (firstLoad || !listIterator.current) {
      listIterator.current = masto.v1.timelines.listList(id, {
        limit: LIMIT,
      });
    }
    return await listIterator.current.next();
  }

  const [title, setTitle] = useState(`List`);
  useTitle(title, `/l/:id`);
  useEffect(() => {
    (async () => {
      try {
        const list = await masto.v1.lists.fetch(id);
        setTitle(list.title);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [id]);

  return (
    <Timeline
      title={title}
      id="list"
      emptyText="Nothing yet."
      errorText="Unable to load posts."
      fetchItems={fetchList}
      boostsCarousel
      headerStart={
        <Link to="/l" class="button plain">
          <Icon icon="list" size="l" />
        </Link>
      }
    />
  );
}

export default List;