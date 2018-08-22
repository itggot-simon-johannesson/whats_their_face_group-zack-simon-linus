class Person
    include DataMapper::Resource

    property :id,         Serial
    property :name,       String
    property :class,      String
    property :image_path, String
end