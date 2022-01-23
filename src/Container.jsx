import { useState, useRef, useCallback } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import update from 'immutability-helper';

const cardStyle = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move',
}

const Card = ({ id, text, index, moveCard}) => {
  const ref = useRef(null); 

  const [{ handlerId }, drop] = useDrop({
    accept: 'card',
    collect(monitor) {
      console.log('drop : ' + monitor.getHandlerId());
      return {
        handleId: monitor.getHandlerId(),
      }
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      moveCard(dragIndex, hoverIndex);
      item.index = hoverIndex;
    }
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'card',
    item: () => {
      return { id, index };
    },
    collect: (monitor) => {
      console.log('drag');
      return { isDragging: monitor.isDragging() }
    }
  })

  const opacity = isDragging ? 0 : 1;

  drag(drop(ref));
  return (
    <div ref={ref} style={{...cardStyle, opacity}} data-handler-id={handlerId}>
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

  const moveCard = useCallback((dragIndex, hoverIndex) => {
    const dragCard = cards[dragIndex];
    setCards(update(cards, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, dragCard],
      ],
    }));
  }, [cards]);

  const renderCard = (card, index) => {
    return (<Card key={card.id} id={card.id} text={card.text} index={index} moveCard={moveCard} />);
  }

  return ( 
    <>
      <div style={{witdh: 400}}>{cards.map((card, i) => renderCard(card, i))}</div>
    </>
  );
}