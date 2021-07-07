import { useHistory, useParams } from 'react-router-dom';

import '../styles/room.scss';
import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'

import { Button } from '../components/Button/Button';

import { Question } from '../components/Question/Questions';
import { RoomCode } from '../components/RoomCode/RoomCode';
//import { useAuth } from '../hooks/useAuth';
import cx from 'classnames';

import { useRoom } from '../hooks/useRooms';
import { database } from '../services/firebase';

type RoomParams = {
  id: string;
}
export function AdminRoom() {
  //const { user } = useAuth();
  const history = useHistory()
  const params = useParams<RoomParams>();
  const roomId = params.id;

  const { title, questions } = useRoom(roomId)

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    })

    history.push('/');
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    });
  }

  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
    });
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
     await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }


  return (
  <div id="page-room">
    <header>
      <div className="content">
        <img src={logoImg} alt="Logo LetMeAsk" />
        <div>
          <RoomCode code={params.id} />
          <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
        </div>
      </div>
    </header>

    <main className="content">
      <div className="room-title">
        <h1>Sala {title}</h1>
        { questions.length > 0 && <span>{questions.length} pergunta(s)</span> }
      </div>

      <div className="question-l">
      {questions.map(question => {
        return (
          <Question 
          key={question.id}
          content={question.content}
          author={question.author}
          isAnswered={question.isAnswered}
          isHighlighted={question.isHighlighted}
          >
            {!question.isAnswered && (
              <>
                <button type="button" onClick={() => handleCheckQuestionAsAnswered(question.id)}>
              <img src = {checkImg} alt="Pergunta respondida" />
            </button>

            <button type="button" onClick={() => handleHighlightQuestion(question.id)}>
              <img src = {answerImg} alt="Destacar pergunta" />
            </button>
            </>
            )}
            <button type="button" onClick={() => handleDeleteQuestion(question.id)}>
              <img src = {deleteImg} alt="Remover pergunta" />
            </button>
          </Question>
        );
      })}
      </div>
    </main>
  </div>
  );
}