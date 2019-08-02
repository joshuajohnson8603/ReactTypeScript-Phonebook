import * as React from 'react';
import MuiFloatingActionButton from 'material-ui/FloatingActionButton';
import MuiTextField from 'material-ui/TextField';
import MuiRaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import * as _ from 'lodash';

import { IPhoneBook, IPhoneBookList } from '../Model';
import { loadState, saveState, sortByStringAscending, sortByStringDescending } from '../Module';

import DataTables from 'material-ui-datatables';


interface IPhoneBookListOwnProps {}
interface IPhoneBookListStateProps {
  items: IPhoneBook[];
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

// Default Data
const PhoneBooks = [
  {
    fname: 'Frozen',
    lname: 'yogurt',
    birth: '1990-09-01',
    phoneno: '235802626',
  },
  {
    fname: 'Willem',
    lname: 'Daniel',
    birth: '1987-09-01',
    phoneno: '856456346',
  },
  {
    fname: 'William',
    lname: 'Roberts',
    birth: '1989-09-01',
    phoneno: '73457457',
  },
  {
    fname: 'Pascal',
    lname: 'Alfred',
    birth: '1992-09-01',
    phoneno: '23456347',
  },
  {
    fname: 'Khary',
    lname: 'Fraizer',
    birth: '1988-09-01',
    phoneno: '34834588',
  },
];

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
  phoneno_errorText: string,
  pagenum: number,
}

class PhoneBookListPage extends React.Component<Props, State> {
  state: State = {
    first_name: '',
    last_name: '',
    birthday: '',
    phonenumber: '',
    allItems: loadState(),
    filterValue: '',
    selected_counter: '',
    editable: false,
    phoneno_errorText: '',
    pagenum: 1,
  };

  props: Props = {
    first_name: '',
    last_name: '',
    birthday: '',
    phonenumber: '',
  };

  componentWillMount() {
    if ( loadState() === undefined ) {
      saveState(PhoneBooks);
    } else {
      let items: PhoneBook[] = loadState();
      let pagenum: number = Math.floor(items.length/10) + 1;
      this.setState({pagenum: pagenum});
    }
  }

  public render(): React.ReactElement<{}> {

    const { first_name, last_name, birthday, phonenumber, filterValue, allItems, selected_counter, editable, phoneno_errorText } = this.state

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
    let filteredItems = allItems;
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
    console.log('pagenum', this.state.pagenum);
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
        <DatePicker
          floatingLabelText="Birthday"
          onChange={(event, date) => this.handleBirthday(event, date)}
        />
        <br />
        <MuiTextField
          floatingLabelText="Phone Number"
          value={phonenumber}
          hintText="xxx-xxx-xxxx"
          onChange={this.handlePhoneNumber}
          errorText={phoneno_errorText}
        />
        <br />
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
          page={this.state.pagenum}
          rowSize={10}
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
    saveState(updatedList);
    this.setState({ first_name: '', last_name: '', birthday: '', phonenumber: '', allItems: updatedList, editable: false});
    console.log('remove-updateList', updatedList);
  }

  private handleAddPhoneBook = (first_name, last_name, birthday, phonenumber, allItems, editable) => {

    if ( this.state.first_name == '' || this.state.last_name == '' || this.state.birthday == '' || this.state.phonenumber == '' ) {
      alert('Please fill all items');
      return;
    }

    var phoneno = /^(\(?\+?[0-9]*\)?)?[0-9_\- \(\)]*$/;

    if ( !this.state.phonenumber.match(phoneno) ) {
      this.setState({ phoneno_errorText: 'invalid phone number'});
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
      saveState(updatedList);
      this.setState({ first_name: '', last_name: '', birthday: '', phonenumber: '', allItems: updatedList, editable: false});
      console.log('edit-updateList', updatedList);

    } else {
      let phone_book:PhoneBook = {
        fname: first_name,
        lname: last_name,
        birth: birthday,
        phoneno: phonenumber,
      };
      let addedList: PhoneBook[] = allItems;
      addedList.push(phone_book);
      saveState(addedList);
      this.setState({ first_name: '', last_name: '', birthday: '', phonenumber: '', allItems: addedList});
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
  }

  private handleCellDoubleClick = (value) => {
    
  }
 
  private handleSortOrderChange = (key, order) => {
    order === 'desc' ? sortByStringDescending(this.state.allItems, key) : sortByStringAscending(this.state.allItems, key)
  }

  private handleFirstName = (e:React.FormEvent<HTMLInputElement>) => {
    this.setState({first_name: e.currentTarget.value});
  }

  private handleLastName = (e:React.FormEvent<HTMLInputElement>) => {
    this.setState({last_name: e.currentTarget.value});
  }

  private handleBirthday = (event, date) => {
    this.setState({birthday: JSON.stringify(date).substring(1, 11)});
  }

  private handlePhoneNumber = (e:React.FormEvent<HTMLInputElement>) => {
    this.setState({phonenumber: e.currentTarget.value});
  } 

}

export default  PhoneBookListPage
