import FriendItem from './FriendItem';

export default function FriendList({ friends }) {
  return (
    <div>
      {friends.map(friend => (
        <FriendItem key={friend._id} friend={friend} />
      ))}
    </div>
  );
}
