import React from 'react';
import Logo from 'components/logo/logo';

export default ({type}) => <Logo
    headerTitle={type === 'EDIT' ? 'Edit Tournament' : 'Create Tournament'}
    img="https://www.publicdomainpictures.net/pictures/220000/velka/open-blank-notebook.jpg" />
