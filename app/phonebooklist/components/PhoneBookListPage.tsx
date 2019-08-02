import * as React from 'react';
import MuiFloatingActionButton from 'material-ui/FloatingActionButton';
import MuiTextField from 'material-ui/TextField';
import MuiRaisedButton from 'material-ui/RaisedButton';
import * as _ from 'lodash';

import { IPhoneBook, IPhoneBookList } from '../Model';
import { changePhoneBook, addPhoneBook, IPhoneBookActionEdit } from '../Module';
import { IAppState } from '../../main';
import { connect } from 'react-redux';

import DataTables from 'material-ui-datatables';


interface IPhoneBookListOwnProps {}
interface IPhoneBookListStateProps {
  items: IPhoneBook[];
}

interface IPhoneBookListDispatchProps {
  addPhoneBook: typeof addPhoneBook;
}

interface IPhoneBookDispatchProps {
  changePhoneBook: typeof changePhoneBook;
}

type IPhoneBookReactState = {
  first_name: string,
  last_name: string,
  birthday: string,
  phonenumber: string,
  filterValue: null,
  allItems: IPhoneBook[],
};

// Styles

const containerStyle: React.CSSProperties = {
  marginTop: '30px',
  width: '1024px',
  margin: '30px auto',
  textAlign: 'center',
};

const valueStyle: React.CSSProperties = {
  verticalAlign: 'middle',
  display: 'block',
  whiteSpace: 'normal',
  margin: 0,
};

const iconStyle: React.CSSProperties = {
  ...valueStyle,
  cursor: 'pointer',
};

const removeIconStyle: React.CSSProperties = {
  ...iconStyle,
  whiteSpace: 'inherit',
};

type PhoneBook = {
  fname: string,
  lname: string,
  birth: string,
  phoneno: string,
}

const PhoneBooks = [
  {
    fname: 'Frozen',
    lname: 'yogurt',
    birth: '1990/09/01',
    phoneno: '235802626',
  },
  {
    fname: 'Willem',
    lname: 'Daniel',
    birth: '1987/09/01',
    phoneno: '856456346',
  },
  {
    fname: 'William',
    lname: 'Roberts',
    birth: '1989/09/01',
    phoneno: '73457457',
  },
  {
    fname: 'Pascal',
    lname: 'Alfred',
    birth: '1992/09/01',
    phoneno: '23456347',
  },
  {
    fname: 'Khary',
    lname: 'Fraizer',
    birth: '1988/09/01',
    phoneno: '34834588',
  },
];

const sortByStringAscending = (array, condition)  => array.sort((a, b) => a[condition].localeCompare(b[condition]));
const sortByStringDescending = (array, condition)  => array.sort((a, b) => b[condition].localeCompare(a[condition]));

type Props = { 
  first_name: string,
  last_name: string,
  birthday: string,
  phonenumber: string,
}

type State = {
  first_name: string,
  last_name: string,
  birthday: string,
  phonenumber: string,
  allItems: PhoneBook[],
  filterValue: string,
  selected_counter: string,
  editable: boolean,
}

class PhoneBookListPage extends React.Component<Props, State> {

  state: State = {
    first_name: '',
    last_name: '',
    birthday: '',
    phonenumber: '',
    allItems: PhoneBooks,
    filterValue: '',
    selected_counter: '',
    editable: false,
  };

  props: Props = {
    first_name: '',
    last_name: '',
    birthday: '',
    phonenumber: '',
  };

  public render(): React.ReactElement<{}> {

    const { first_name, last_name, birthday, phonenumber, filterValue, allItems, selected_counter, editable } = this.state

    const TABLE_COLUMNS = [
      {
        key: 'fname',
        label: 'First name',
        sortable: true,
        tooltip: 'first name',
      }, {
        key: 'lname',
        label: 'Last name',
        sortable: true,
        tooltip: 'last name',
      },{
        key: 'birth',
        label: 'Birthday',
        sortable: true,
        tooltip: 'birthday',
      },{
        key: 'phoneno',
        label: 'Phone number',
        sortable: true,
        tooltip: 'phone number',
      },
      {
        key: '',
        label: '',
        render: (name, all) => <i data-t-id='edit' style={iconStyle} onClick={() =>this.handleEdit(name, all)} className='material-icons'>edit</i>
      },
      {
        key: '',
        label: '',
        render: (name, all) => <i data-t-id='remove' style={removeIconStyle} onClick={() =>this.handleRemove(name, all)} className='material-icons'>delete forever</i>
      },
    ];

    // Only filter if required
    let filteredItems = PhoneBooks;
    let tableColumns = TABLE_COLUMNS;
    // Filter to select only the items that pass our seach, but only in the selected columns
    if (filterValue) {
      filteredItems = filteredItems.filter((item) => {

        for (const currentColumn of tableColumns) {
          if (_.get(item, currentColumn.key, '').toString().toLowerCase().includes(filterValue)) {
            return true;
          }
        }

        return false;
      });
    }
    
    return (
      <div style={containerStyle}>
        <MuiRaisedButton
          style={{width:'256px'}}
          secondary={true}
          onMouseUp={() => this.handleAddPhoneBook(first_name, last_name, birthday, phonenumber, allItems, editable)}
        >
          {editable ? 'Edit' : 'Add' }
        </MuiRaisedButton>
        <br />
        <MuiTextField
          floatingLabelText="First name"
          value={first_name}
          onChange={this.handleFirstName}
        />
        <br />
        <MuiTextField
          floatingLabelText="Last name"
          value={last_name}
          onChange={this.handleLastName}
        />
        <br />
        <MuiTextField
          floatingLabelText="Birthday"
          value={birthday}
          onChange={this.handleBirthday}
        />
        <br />
        <MuiTextField
          floatingLabelText="Phone Number"
          value={phonenumber}
          onChange={this.handlePhoneNumber}
        />
        <br />
        {/* <div data-t-id='remove-area'>
          <p style={selectedStyle}> {selected_counter} selected </p>
          <i data-t-id='remove' style={iconStyle} className='material-icons'>delete forever</i>
        </div>
        <i data-t-id='edit' style={iconStyle} className='material-icons'>edit</i> */}
        <DataTables
          height={'auto'}
          selectable={true}
          showRowHover={true}
          columns={TABLE_COLUMNS}
          data={filteredItems}
          showCheckboxes={true}
          onCellDoubleClick={this.handleCellDoubleClick}
          onFilterValueChange={this.handleFilterValueChange}
          onSortOrderChange={this.handleSortOrderChange}
          onRowSelection={this.handleRowSelection}
          enableSelectAll={true}
          page={1}
          count={100}
          multiSelectable={true}
          showHeaderToolbar
        />
      </div>
    );
  }

  //
  // Event handlers
  //

  private handleEdit = (name, all) => {
    console.log('all', all.fname);
    this.setState({ first_name: all.fname, last_name: all.lname, birthday: all.birth, phonenumber: all.phoneno, editable: true});
  }

  private handleRemove = (name, all) => {
    console.log('all', all);
    let updatedList = this.state.allItems;
    for (var i in this.state.allItems) {
      if (this.state.allItems[i].phoneno == all.phoneno) {
        console.log('i', i);
        updatedList.splice(+i, 1);
      }
    }

    this.setState({ first_name: '', last_name: '', birthday: '', phonenumber: '', allItems: updatedList, editable: false});
    console.log('updateList', updatedList);
  }

  private handleAddPhoneBook = (first_name, last_name, birthday, phonenumber, allItems, editable) => {

    if ( this.state.first_name == '' || this.state.last_name == '' || this.state.birthday == '' || this.state.phonenumber == '' ) {
      alert('Please fill all items');
      return;
    }

    let updatedList = allItems;
    if ( editable ) {
      for (var i in updatedList) {
        if (updatedList[i].phoneno == phonenumber || updatedList[i].birth == birthday) {
          console.log('edit', i);
          updatedList[i].fname = first_name;
          updatedList[i].lname = last_name;
          updatedList[i].birth = birthday;
          updatedList[i].phoneno = phonenumber;
          break;
        }
      }
      this.setState({ first_name: '', last_name: '', birthday: '', phonenumber: '', allItems: updatedList, editable: false});
      console.log('updateList', updatedList);

    } else {
      let phone_book:PhoneBook = {
        fname: first_name,
        lname: last_name,
        birth: birthday,
        phoneno: phonenumber,
      };
      PhoneBooks.push(phone_book);
      this.setState({ first_name: '', last_name: '', birthday: '', phonenumber: '', allItems: PhoneBooks});
    }   
  }

  private handleFilterValueChange = (value) => {
    if (value) {
      value = value.toLowerCase();
    }
    this.setState({filterValue: value});
  }

  private handleRowSelection = (value) => {
    console.log('value', value['length']);

    // if ( value ) {
    //   this.setState({selected_counter: value['length']});
    // }
  }

  private handleCellDoubleClick = (value) => {
    
  }
 
  private handleSortOrderChange = (key, order) => {
    order === 'desc' ? sortByStringDescending(PhoneBooks, key) : sortByStringAscending(PhoneBooks, key)
  }

  private handleFirstName = (e:React.FormEvent<HTMLInputElement>) => {
    this.setState({first_name: e.currentTarget.value});
  }

  private handleLastName = (e:React.FormEvent<HTMLInputElement>) => {
    this.setState({last_name: e.currentTarget.value});
  }

  private handleBirthday = (e:React.FormEvent<HTMLInputElement>) => {
    this.setState({birthday: e.currentTarget.value});
  }

  private handlePhoneNumber = (e:React.FormEvent<HTMLInputElement>) => {
    this.setState({phonenumber: e.currentTarget.value});
  } 

}

export default  PhoneBookListPage
