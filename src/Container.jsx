import { useState, useRef, useCallback } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import update from 'immutability-helper';

const cardStyle = {
  border: '1px solid gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  cursor: 'move',
}

const Card = ({ text, index, moveCard}) => {
  const ref = useRef(null); 

  const [, drop] = useDrop({
    accept: 'card',
    collect(monitor) {
      console.log('drop');  // dropイベント発生の処理
    },
    hover(item, monitor) {  // dragイベント中に自要素の上にdrag中の要素が重なっている時の処理
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index; // 現在、ドラッグしている要素のindex
      const hoverIndex = index;   // 現在、下にある要素のindex
      if (dragIndex === hoverIndex) { // ドラッグしている要素と下にある要素が同じ場合は何もしない
        return;
      }
      console.log('hover');
      console.log('dragIndex ', dragIndex);
      console.log('hoverIndex', hoverIndex);
      moveCard(dragIndex, hoverIndex);  // 要素の入れ替え
      item.index = hoverIndex;
    }
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'card',
    item: () => {
      return { index }; // hoverイベントなどで扱いたい要素のプロパティをここで定義
    },
    collect: (monitor) => { // dragイベント発生自の処理
      console.log('drag');
      return { isDragging: monitor.isDragging() }
    }
  })

  const opacity = isDragging ? 0 : 1; // 要素を掴んだ時に掴んだ要素を半透明にする処理
  drag(drop(ref));  // dragとdropを同じ要素にする為の処理
  return (
    <div ref={ref} style={{...cardStyle, opacity}}>
      {text}
    </div>
  )
}

export const Container = () => {
  const [cards, setCards] = useState([
    { id: 1, text: 'item1' },
    { id: 2, text: 'item2' },
    { id: 3, text: 'item3' },
  ]);

  // 要素の入れ替え処理
  const moveCard = useCallback((dragIndex, hoverIndex) => {
    const dragCard = cards[dragIndex];
    setCards(update(cards, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, dragCard],
      ],
    }));
  }, [cards]);

  return ( 
    <>
      <div style={{width: 400}}>
        {cards.map((card, index) => 
          (<Card key={card.id} text={card.text} index={index} moveCard={moveCard} />)
        )}
      </div>
    </>
  );
}