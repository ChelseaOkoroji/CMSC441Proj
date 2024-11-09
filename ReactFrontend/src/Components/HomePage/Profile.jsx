import './Profile.css';
import { useUser } from '../../UserContext';

const Profile = () => {
    const { user } = useUser();

    return (
            <div className='Profile'>
                <span className='profile-info'>
                    Profile Info of {user.userID} 
                    User's email: {user.email}

                </span>


            </div>
    );
};

export default Profile;