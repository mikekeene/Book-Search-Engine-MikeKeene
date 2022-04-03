import React, { useEffect } from 'react'; //removed useEffect & useState Hooks
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';
//import useQuery & useMutation React Hooks
import { useQuery, useMutation } from '@apollo/client';
// import mutation for removing books from saved books
import { REMOVE_BOOK } from '../utils/mutations';
// import GET_ME query to query user data 
import { GET_ME } from '../utils/queries';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

//TODO: Remove useEffect() Hook that sets the state for UserData.
//TODO: useQuery() Hook to execute GET_ME query on load & save it to userData.



const SavedBooks = () => {
  // these variables are destructured from useQuery hook
  const { loading, error, data } = useQuery(GET_ME); //executes GET_ME query
  // return user data in me object or as an empty object if no saved books
  const userData = data?.me || {};
  // error messages
  if (error) {
    console.log(error.message);
  }
  // mutation for deleting book from saved books
  const [removeBook] = useMutation(REMOVE_BOOK);

  // create function that deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    // determine if user logged in and it's authenticated
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    // if token is not present, not authenticated
    if (!token) {
      return false;
    }
    // try...catch
    try{
      await removeBook({ variables: { bookId }});
      // upon success, remove book's id from localStorage
      removeBookId(bookId); //keep removeBookId functionality
    } catch (err) {
      console.error(err);
    }
  };

  // if loading data, display loading message
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <CardColumns>
          {userData.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} border='dark'>
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;
