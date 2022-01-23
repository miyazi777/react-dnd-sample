import { useState, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

const cardStyle = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move',
}

const Card = ({ id, text, index}) => {
  const ref = useRef(null); 

  const [{ handlerId }, drop] = useDrop({
    accept: 'card',
    collect(monitor) {
      console.log('drop : ' + monitor.getHandlerId());
      return {
        handleId: monitor.getHandlerId(),
      }
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

  const renderCard = (card, index) => {
    return (<Card key={card.id} id={card.id} text={card.text} index={index} />);
  }

  return ( 
    <>
      <div style={{witdh: 400}}>{cards.map((card, i) => renderCard(card, i))}</div>
    </>
  );
}