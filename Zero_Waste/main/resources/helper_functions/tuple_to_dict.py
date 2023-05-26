def tuple_to_dict(tuple_data, columns) :
    final_data = []
    for row in tuple_data:
                final_data.append(dict(zip(columns, row)))
    return(final_data)