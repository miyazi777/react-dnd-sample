import { useState } from 'react';


const cardStyle = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move',
}

const Card = ({ id, text, index}) => {

  return (
    <div style={cardStyle}>
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